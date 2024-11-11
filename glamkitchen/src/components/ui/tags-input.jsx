

import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { X as RemoveIcon } from 'lucide-react'
import React, { useState, useEffect, useCallback, useContext, createContext } from 'react'

const SPLITTER_REGEX = /[\n#?=&\t,./-]+/
const FORMATTING_REGEX = /^[^a-zA-Z0-9]*|[^a-zA-Z0-9]*$/g

const TagInputContext = createContext(null)

export const TagsInput = React.forwardRef(
    (
        {
            children,
            value,
            onValueChange,
            placeholder,
            maxItems,
            minItems,
            className,
            dir,
            ...props
        },
        ref,
    ) => {
        const [activeIndex, setActiveIndex] = useState(-1)
        const [inputValue, setInputValue] = useState('')
        const [disableInput, setDisableInput] = useState(false)
        const [disableButton, setDisableButton] = useState(false)
        const [isValueSelected, setIsValueSelected] = useState(false)
        const [selectedValue, setSelectedValue] = useState('')

        const parseMinItems = minItems || 0
        const parseMaxItems = maxItems || Infinity

        const onValueChangeHandler = useCallback(
            (val) => {
                if (!value.includes(val) && value.length < parseMaxItems) {
                    onValueChange([...value, val])
                }
            },
            [value]
        )

        const RemoveValue = useCallback(
            (val) => {
                if (value.includes(val) && value.length > parseMinItems) {
                    onValueChange(value.filter((item) => item !== val))
                }
            },
            [value]
        )

        const handlePaste = useCallback(
            (e) => {
                e.preventDefault()
                const tags = e.clipboardData.getData('text').split(SPLITTER_REGEX)
                const newValue = [...value]
                tags.forEach((item) => {
                    const parsedItem = item.replaceAll(FORMATTING_REGEX, '').trim()
                    if (
                        parsedItem.length > 0 &&
                        !newValue.includes(parsedItem) &&
                        newValue.length < parseMaxItems
                    ) {
                        newValue.push(parsedItem)
                    }
                })
                onValueChange(newValue)
                setInputValue('')
            },
            [value]
        )

        const handleSelect = useCallback(
            (e) => {
                e.preventDefault()
                const target = e.currentTarget
                const selection = target.value.substring(
                    target.selectionStart || 0,
                    target.selectionEnd || 0
                )

                setSelectedValue(selection)
                setIsValueSelected(selection === inputValue)
            },
            [inputValue]
        )

        useEffect(() => {
            const VerifyDisable = () => {
                setDisableButton(value.length - 1 < parseMinItems)
                setDisableInput(value.length + 1 > parseMaxItems)
            }
            VerifyDisable()
        }, [value])

        const handleKeyDown = useCallback(
            (e) => {
                e.stopPropagation()

                const moveNext = () => {
                    setActiveIndex(activeIndex + 1 > value.length - 1 ? -1 : activeIndex + 1)
                }

                const movePrev = () => {
                    setActiveIndex(activeIndex - 1 < 0 ? value.length - 1 : activeIndex - 1)
                }

                const moveCurrent = () => {
                    setActiveIndex(activeIndex - 1 <= 0 ? value.length - 1 === 0 ? -1 : 0 : activeIndex - 1)
                }

                const target = e.currentTarget

                switch (e.key) {
                    case 'ArrowLeft':
                        if (dir === 'rtl') {
                            if (value.length > 0 && activeIndex !== -1) {
                                moveNext()
                            }
                        } else if (value.length > 0 && target.selectionStart === 0) {
                            movePrev()
                        }
                        break

                    case 'ArrowRight':
                        if (dir === 'rtl') {
                            if (value.length > 0 && target.selectionStart === 0) {
                                movePrev()
                            }
                        } else if (value.length > 0 && activeIndex !== -1) {
                            moveNext()
                        }
                        break

                    case 'Backspace':
                    case 'Delete':
                        if (value.length > 0) {
                            if (activeIndex !== -1 && activeIndex < value.length) {
                                RemoveValue(value[activeIndex])
                                moveCurrent()
                            } else if (target.selectionStart === 0) {
                                if (selectedValue === inputValue || isValueSelected) {
                                    RemoveValue(value[value.length - 1])
                                }
                            }
                        }
                        break

                    case 'Escape':
                        setActiveIndex(activeIndex === -1 ? value.length - 1 : -1)
                        break

                    case 'Enter':
                        if (inputValue.trim() !== '') {
                            e.preventDefault()
                            onValueChangeHandler(inputValue)
                            setInputValue('')
                        }
                        break
                }
            },
            [activeIndex, value, inputValue, RemoveValue]
        )

        const mousePreventDefault = useCallback((e) => {
            e.preventDefault()
            e.stopPropagation()
        }, [])

        const handleChange = useCallback(
            (e) => {
                setInputValue(e.currentTarget.value)
            },
            []
        )

        return (
            <TagInputContext.Provider
                value={{
                    value,
                    onValueChange,
                    inputValue,
                    setInputValue,
                    activeIndex,
                    setActiveIndex,
                }}
            >
                <div
                    {...props}
                    ref={ref}
                    dir={dir}
                    className={cn(
                        'flex items-center flex-wrap gap-1 p-1 rounded-lg bg-background overflow-hidden ring-1 ring-muted',
                        {
                            'focus-within:ring-ring': activeIndex === -1,
                        },
                        className,
                    )}
                >
                    {value.map((item, index) => (
                        <Badge
                            tabIndex={activeIndex !== -1 ? 0 : activeIndex}
                            key={item}
                            aria-disabled={disableButton}
                            data-active={activeIndex === index}
                            className={cn(
                                "relative px-1 rounded flex items-center gap-1 data-[active='true']:ring-2 data-[active='true']:ring-muted-foreground truncate aria-disabled:opacity-50 aria-disabled:cursor-not-allowed",
                            )}
                            variant={'secondary'}
                        >
                            <span className="text-xs">{item}</span>
                            <button
                                type="button"
                                aria-label={`Remove ${item} option`}
                                aria-roledescription="button to remove option"
                                disabled={disableButton}
                                onMouseDown={mousePreventDefault}
                                onClick={() => RemoveValue(item)}
                                className="disabled:cursor-not-allowed"
                            >
                                <span className="sr-only">Remove {item} option</span>
                                <RemoveIcon className="h-4 w-4 hover:stroke-destructive" />
                            </button>
                        </Badge>
                    ))}
                    <Input
                        tabIndex={0}
                        aria-label="input tag"
                        disabled={disableInput}
                        onKeyDown={handleKeyDown}
                        onPaste={handlePaste}
                        value={inputValue}
                        onSelect={handleSelect}
                        onChange={activeIndex === -1 ? handleChange : undefined}
                        placeholder={placeholder}
                        onClick={() => setActiveIndex(-1)}
                        className={cn(
                            'outline-0 border-none h-7 min-w-fit flex-1 focus-visible:outline-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-0 placeholder:text-muted-foreground px-1',
                            activeIndex !== -1 && 'caret-transparent',
                        )}
                    />
                </div>
            </TagInputContext.Provider>
        )
    },
)

TagsInput.displayName = 'TagsInput'

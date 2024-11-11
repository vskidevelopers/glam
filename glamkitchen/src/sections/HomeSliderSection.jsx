import "./section-styles/homeSliders.css"

import HomeSliders from '@/components/HomeSliders';

export default function HomeSlidersSection({ title }) {
    const OPTIONS = { loop: true }

    const KITCHENWARE_PRODUCTS = [
        { title: 'Non-Stick Frying Pan', imageUrl: 'https://images.pexels.com/photos/1278005/pexels-photo-1278005.jpeg', description: 'Perfect for cooking without the mess.' },
        { title: 'Chef Knife', imageUrl: 'https://images.pexels.com/photos/4198169/pexels-photo-4198169.jpeg', description: 'Sharp and durable for all your cutting needs.' },
        { title: 'Mixing Bowl Set', imageUrl: 'https://shopusa.co.ke/cdn/shop/products/10-piece-bamboo-melamine-mixing-bowls-with-lids-set-shopusa-kenya-4_840x700.jpg', description: 'Ideal for baking and food preparation.' },
        { title: 'Blender', imageUrl: 'https://www.ramtons.com/media/catalog/product/cache/32b956110227e3c27aafb884dfa406d5/r/m/rm580_1.jpg', description: 'Blend smoothies, soups, and sauces with ease.' },
        { title: 'Cutting Board', imageUrl: 'https://images.immediate.co.uk/production/volatile/sites/30/2020/08/board-e947b51.jpg', description: 'Durable surface for all your chopping tasks.' }
    ];


    return (
        <div className="py-12 ">
            <div className="text-center mb-10 relative">
                <h2 className="text-4xl font-extrabold text-gray-900">
                    <span className="relative inline-block">
                        <span className="absolute inset-0 bg-flame-800 h-2/3 w-full -skew-y-2"></span>
                        <span className="relative">{title}</span>
                    </span>
                </h2>

                <div className="absolute top-0 left-0 h-full w-full flex justify-end items-baseline opacity-10">
                    <h1 className="text-7xl md:text-9xl font-bold"> {title}</h1>
                </div>
                <p className="text-lg text-gray-500 mt-3">Explore our hand-picked selection of premium products</p>
            </div>
            <HomeSliders slides={KITCHENWARE_PRODUCTS} options={OPTIONS} />
        </div>
    );

}





import React from 'react'
import { Card } from '../ui/card'
import { AspectRatio } from '@radix-ui/react-aspect-ratio'
import Image from 'next/image'

export const DishCard = ({
    title,
    description,
    imageUrl,
    price,
}:{
    title: string,
    description: string,
    imageUrl: string,
    price: number,
}) => {
  return (
    <Card className='w-[20rem] lg:w-[26rem] h-full p-4 bg-amber-100 text-black'>
        <div className='flex flex-col gap-4'>
            <AspectRatio ratio={1}>
                <Image src={imageUrl} alt={title} width={200} height={200} className='w-full h-full object-cover rounded-xl' />
            </AspectRatio>
            <h2 className='text-xl font-cinzel-decorative font-semibold'>{title}</h2>
            <p className='text-sm font-serif font-light text-muted-foreground'>{description}</p>
            <p className='text-3xl font-cinzel-decorative font-semibold'>{price} FCFA</p>
        </div>
    </Card>
  )
}

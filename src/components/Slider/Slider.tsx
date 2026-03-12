"use client"
import React from 'react'
import Autoplay from "embla-carousel-autoplay"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"

import Image from 'next/image';

export default function Slider({ images, title }: { images: string[], title: string }) {
    return <>
        <Carousel
            className="w-full object-contain mx-auto sm:max-w-xs p-0"
            plugins={[
                Autoplay({
                    delay: 2000,
                }),
            ]}
            opts={{
                align: "start",
                loop: true,
            }}>
            <CarouselContent>
                {images.map((img, index) =>
                    <CarouselItem key={index}>
                        <Image src={img} alt={title} width={1000} height={700} className="w-full" />
                    </CarouselItem>
                )}
            </CarouselContent>
        </Carousel>
    </>
}

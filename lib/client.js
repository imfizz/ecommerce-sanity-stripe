import sanityClient from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";

// this will connect to sanity
export const client = sanityClient({
    projectId: '0e4h6j32',
    dataset: 'production',
    apiVersion: '2022-06-18',
    useCdn: true,
    token: process.env.NEXT_PUBLIC_SANITY_TOKEN
})

const builder = imageUrlBuilder(client) // this will give access to the sanity image url

export const urlFor = (source) => builder.image(source) // export the url of the image
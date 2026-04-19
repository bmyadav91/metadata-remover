import { ImageSourcePropType } from 'react-native';

// Define icon paths
export const media = {
    google: require('@/assets/icons/google.png'),

    // remote sources
    remote_location_marker: 'https://ik.imagekit.io/whatbm/public/icons/location_marker.png',
    remote_shop: 'https://ik.imagekit.io/whatbm/public/icons/no_shop_preview_image_square.png',
    remote_no_preview_square: 'https://ik.imagekit.io/whatbm/public/icons/no_preview_image_square.png',
    remote_no_preview_large: 'https://ik.imagekit.io/whatbm/public/icons/no_preview_image_large.png',
    remote_no_login: 'https://ik.imagekit.io/whatbm/public/vectors/no_login.png',
    remote_no_result: 'https://ik.imagekit.io/whatbm/public/vectors/no_result_found.png',

    // Add more icons as needed

} as const;

// Type for icon names
export type IconName = keyof typeof media;

// Helper function to getImageSource icon source
export const getImageSource = (name: IconName): ImageSourcePropType => {
    const source = media[name];

    // If it's a string (URL), wrap it in the 'uri' object
    if (typeof source === 'string') {
        return { uri: source };
    }

    // If it's a number (result of require), return it directly
    return source;
};
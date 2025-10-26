/**
 * Cloudinary Image Optimization Utilities
 * 
 * Provides functions to transform Cloudinary URLs for different use cases
 * with optimized dimensions and transformations.
 */

export interface CloudinaryTransformOptions {
    width?: number;
    height?: number;
    crop?: 'fill' | 'fit' | 'scale' | 'crop' | 'thumb';
    quality?: 'auto' | number;
    format?: 'auto' | 'webp' | 'jpg' | 'png';
    gravity?: 'auto' | 'center' | 'face' | 'faces';
}

/**
 * Transform a Cloudinary URL with optimization parameters
 * @param originalUrl - Original Cloudinary URL
 * @param options - Transformation options
 * @returns Optimized Cloudinary URL
 */
export const transformCloudinaryImage = (
    originalUrl: string,
    options: CloudinaryTransformOptions = {}
): string => {
    // Check if it's a Cloudinary URL
    if (!originalUrl.includes('res.cloudinary.com')) {
        return originalUrl;
    }

    // Parse the URL to extract the path after /upload/
    const urlParts = originalUrl.split('/upload/');
    if (urlParts.length !== 2) {
        return originalUrl;
    }

    // Build transformation parameters
    const transformations: string[] = [];

    // Add crop mode
    const crop = options.crop || 'fill';
    transformations.push(`c_${crop}`);

    // Add dimensions
    if (options.width) {
        transformations.push(`w_${options.width}`);
    }
    if (options.height) {
        transformations.push(`h_${options.height}`);
    }

    // Add quality optimization
    const quality = options.quality || 'auto';
    if (quality === 'auto') {
        transformations.push('q_auto');
    } else {
        transformations.push(`q_${quality}`);
    }

    // Add format optimization
    const format = options.format || 'auto';
    if (format === 'auto') {
        transformations.push('f_auto');
    } else {
        transformations.push(`f_${format}`);
    }

    // Add gravity for better cropping
    if (options.gravity) {
        transformations.push(`g_${options.gravity}`);
    }

    // Join transformations
    const transformationString = transformations.join(',');

    return `${urlParts[0]}/upload/${transformationString}/${urlParts[1]}`;
};

/**
 * Predefined transformations for common use cases
 */
export const CloudinaryPresets = {
    // Event card thumbnail (128x128px)
    eventCardThumbnail: (url: string) => transformCloudinaryImage(url, {
        width: 300,
        height: 200,
        crop: 'fill',
        quality: 'auto',
        format: 'auto',
        gravity: 'auto'
    }),

    // Event card banner (larger size)
    eventCardBanner: (url: string) => transformCloudinaryImage(url, {
        width: 400,
        height: 250,
        crop: 'fill',
        quality: 'auto',
        format: 'auto',
        gravity: 'auto'
    }),

    // Event detail banner (full width)
    eventDetailBanner: (url: string) => transformCloudinaryImage(url, {
        width: 800,
        height: 400,
        crop: 'fill',
        quality: 'auto',
        format: 'auto',
        gravity: 'auto'
    }),

    // Profile image
    profileImage: (url: string) => transformCloudinaryImage(url, {
        width: 150,
        height: 150,
        crop: 'fill',
        quality: 'auto',
        format: 'auto',
        gravity: 'face'
    }),

    // Small thumbnail
    thumbnail: (url: string) => transformCloudinaryImage(url, {
        width: 100,
        height: 100,
        crop: 'fill',
        quality: 'auto',
        format: 'auto',
        gravity: 'auto'
    })
};

/**
 * Legacy function for backward compatibility
 * @deprecated Use CloudinaryPresets.eventCardThumbnail instead
 */
export const optimizeCloudinaryImage = (originalUrl: string, width: number = 300, height: number = 200): string => {
    return transformCloudinaryImage(originalUrl, {
        width,
        height,
        crop: 'fill',
        quality: 'auto',
        format: 'auto',
        gravity: 'auto'
    });
};

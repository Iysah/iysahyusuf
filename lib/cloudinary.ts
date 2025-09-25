// Cloudinary configuration for client-side operations

export interface CloudinaryUploadResult {
  public_id: string;
  secure_url: string;
  format: string;
  resource_type: string;
  width?: number;
  height?: number;
  duration?: number;
}

// Upload image or video to Cloudinary
export async function uploadToCloudinary(
  file: File,
  folder: string = 'portfolio/resources'
): Promise<CloudinaryUploadResult> {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'portfolio_resources'); // You'll need to create this preset
    formData.append('folder', folder);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/auto/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error('Failed to upload to Cloudinary');
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw error;
  }
}

// Delete image or video from Cloudinary (server-side only)
export async function deleteFromCloudinary(publicId: string): Promise<void> {
  try {
    const response = await fetch('/api/cloudinary/delete', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ publicId }),
    });

    if (!response.ok) {
      throw new Error('Failed to delete from Cloudinary');
    }
  } catch (error) {
    console.error('Error deleting from Cloudinary:', error);
    throw error;
  }
}

// Generate optimized URL for images
export function getOptimizedImageUrl(
  publicId: string,
  options: {
    width?: number;
    height?: number;
    quality?: string;
    format?: string;
  } = {}
): string {
  const { width, height, quality = 'auto', format = 'auto' } = options;
  
  let transformation = `f_${format},q_${quality}`;
  
  if (width) transformation += `,w_${width}`;
  if (height) transformation += `,h_${height}`;
  
  return `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/${transformation}/${publicId}`;
}

// Generate optimized URL for videos
export function getOptimizedVideoUrl(
  publicId: string,
  options: {
    width?: number;
    height?: number;
    quality?: string;
  } = {}
): string {
  const { width, height, quality = 'auto' } = options;
  
  let transformation = `q_${quality}`;
  
  if (width) transformation += `,w_${width}`;
  if (height) transformation += `,h_${height}`;
  
  return `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/video/upload/${transformation}/${publicId}`;
}

// Get Cloudinary upload widget configuration
export const getUploadWidgetConfig = (onSuccess: (result: any) => void) => ({
  cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  uploadPreset: 'portfolio_resources',
  folder: 'portfolio/resources',
  multiple: false,
  maxFiles: 1,
  resourceType: 'auto',
  clientAllowedFormats: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'mp4', 'mov', 'avi'],
  maxFileSize: 10000000, // 10MB
  sources: ['local', 'url', 'camera'],
  showAdvancedOptions: false,
  cropping: false,
  showSkipCropButton: true,
  croppingAspectRatio: 16 / 9,
  theme: 'minimal',
  styles: {
    palette: {
      window: '#FFFFFF',
      windowBorder: '#90A0B3',
      tabIcon: '#0078FF',
      menuIcons: '#5A616A',
      textDark: '#000000',
      textLight: '#FFFFFF',
      link: '#0078FF',
      action: '#FF620C',
      inactiveTabIcon: '#0E2F5A',
      error: '#F44235',
      inProgress: '#0078FF',
      complete: '#20B832',
      sourceBg: '#E4EBF1'
    }
  },
  text: {
    en: {
      or: 'or',
      back: 'Back',
      advanced: 'Advanced',
      close: 'Close',
      no_results: 'No Results',
      search_placeholder: 'Search files',
      about_uw: 'About Upload Widget'
    }
  }
});

// Export cloud name for client-side usage
export const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
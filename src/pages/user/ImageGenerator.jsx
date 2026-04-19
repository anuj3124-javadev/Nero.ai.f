import React from 'react';
import ImageGeneratorComponent from '../../components/image/ImageGenerator';

const ImageGenerator = () => {
    return (
        <div className="py-10 bg-gray-50 dark:bg-gray-900 min-h-full transition-colors duration-300">
            <div className="px-6 mb-8 text-center">
                <h1 className="text-3xl font-bold dark:text-white mb-2 underline decoration-indigo-500 underline-offset-8">
                    Creative Studio
                </h1>
                <p className="text-gray-500">Transform your imagination into digital art.</p>
            </div>
            
            <ImageGeneratorComponent />
        </div>
    );
};

export default ImageGenerator;

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type GraphicsQuality = 'low' | 'medium' | 'high';

interface GraphicsContextType {
    quality: GraphicsQuality;
    setQuality: (quality: GraphicsQuality) => void;
}

const GraphicsContext = createContext<GraphicsContextType | undefined>(undefined);

export const useGraphics = () => {
    const context = useContext(GraphicsContext);
    if (!context) {
        throw new Error('useGraphics must be used within GraphicsProvider');
    }
    return context;
};

const detectQuality = (): GraphicsQuality => {
    // Default to low for best compatibility
    return 'low';
};

export const GraphicsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [quality, setQualityState] = useState<GraphicsQuality>(() => {
        const saved = localStorage.getItem('graphics-quality');
        if (saved && ['low', 'medium', 'high'].includes(saved)) {
            return saved as GraphicsQuality;
        }
        return detectQuality();
    });

    const setQuality = (newQuality: GraphicsQuality) => {
        setQualityState(newQuality);
        localStorage.setItem('graphics-quality', newQuality);
    };

    useEffect(() => {
        // Save initial detected quality if not set
        if (!localStorage.getItem('graphics-quality')) {
            localStorage.setItem('graphics-quality', quality);
        }
    }, []);

    return (
        <GraphicsContext.Provider value={{ quality, setQuality }}>
            {children}
        </GraphicsContext.Provider>
    );
};

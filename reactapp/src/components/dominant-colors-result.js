import * as React from 'react';
import './styles/dominant-colors-result.css';

function rgbToHex(rgb) {
    const hex = Number(rgb).toString(16);
    if (hex.length < 2) {
        return '0' + hex;
    }
    return hex;
}

/**
 * @return {null | HTMLElement}
 */
export function DominantColorsResult({ dominantColors }) {
    if (!dominantColors) {
        return null;
    }

    let i = 1;
    const colors = dominantColors.colors
        .sort((first, second) => {
            if (second.pixelFraction < first.pixelFraction) {
                return -1;
            }
            return 1;
        })
        .map(color => {
            const c = `rgb(${color.color.red}, ${color.color.green}, ${color.color.blue})`;
            return (
                <div key={'dominant-colors-' + i++} className={'color--wrapper'}>
                    <div className={'color__div'} style={{ backgroundColor: c }}/>
                    <div className={'color__info'}>
                        Color: #{rgbToHex(color.color.red)}{rgbToHex(color.color.green)}{rgbToHex(color.color.blue)}<br/>
                        Score: {color.score.toFixed(4)}<br/>
                        Pixel Fraction: {color.pixelFraction.toFixed(4)}
                    </div>
                </div>
            );
        });
    return (
        <>
            <h2>Dominant Colors</h2>
            {colors}
        </>
    );
}

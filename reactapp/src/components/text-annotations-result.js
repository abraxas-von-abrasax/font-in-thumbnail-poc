import * as React from 'react';
import './styles/text-annotations-result.css';

/**
 * @return {null | HTMLElement}
 */
export function TextAnnotationsResult({ textAnnotations, onGotSmallestFontSize }) {
    if (!textAnnotations || !textAnnotations.length) {
        onGotSmallestFontSize(null);
        return null;
    }

    let i = 1;
    let smallestPixelSize = null;

    const annotations = textAnnotations.map(dataRow => {
        const pixelSize = dataRow.boundingPoly.vertices[2].y - dataRow.boundingPoly.vertices[0].y;
        if (!smallestPixelSize) {
            smallestPixelSize = pixelSize;
        } else if (pixelSize < smallestPixelSize) {
            smallestPixelSize = pixelSize;
        }
        return (
            <div key={'text-annotation-' + i++} className={'element'}>
                <strong>Text: {dataRow.description}</strong><br/>
                Locale: {dataRow.locale || 'not included'}<br/>
                Confidence: {dataRow.confidence}<br/>
                Vertices:<br/>
                <div className={'element__vertices'}>
                    0: (x: {dataRow.boundingPoly.vertices[0].x}, y: {dataRow.boundingPoly.vertices[0].y})<br/>
                    1: (x: {dataRow.boundingPoly.vertices[1].x}, y: {dataRow.boundingPoly.vertices[1].y})<br/>
                    2: (x: {dataRow.boundingPoly.vertices[2].x}, y: {dataRow.boundingPoly.vertices[2].y})<br/>
                    3: (x: {dataRow.boundingPoly.vertices[3].x}, y: {dataRow.boundingPoly.vertices[3].y})
                </div>
                <strong>Pixel size: {pixelSize}px</strong>
            </div>
        );
    });

    onGotSmallestFontSize(smallestPixelSize);

    return (
        <>
            <h2>Text Annotations</h2>
            {annotations}
        </>
    );
}

import * as React from 'react';
import './styles/text-annotations-result.css';

/**
 * @return {null | HTMLElement}
 */
export function TextAnnotationsResult({ textAnnotations }) {
    if (!textAnnotations || !textAnnotations.length) {
        return null;
    }

    let i = 1;
    const annotations = textAnnotations.map(dataRow => (
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
            <strong>Pixel size: {dataRow.boundingPoly.vertices[2].y - dataRow.boundingPoly.vertices[0].y}px</strong>
        </div>
    ));
    return (
        <>
            <h2>Text Annotations</h2>
            {annotations}
        </>
    );
}

import * as React from 'react';

/**
 * @return {null | HTMLElement}
 */
export function FullPageAnnotationsResult({ fullTextAnnotation }) {
    if (!fullTextAnnotation) {
        return null;
    }

    console.log('Full Page Annotations:', fullTextAnnotation);

    return (
        <>
            <h2>Full Text Annotation</h2>
            <p>Look into the developer tools' console to see the full page annotation.</p>
        </>
    );
}

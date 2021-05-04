import { useState } from 'react';
import './index.css';
import EntItemBox from './EntItemBox/EntItemBox';

export interface labelType {
  id: number;
  text: string;
  prefixKey: null;
  suffixKey: string;
  backgroundColor: string;
  textColor: string;
}

export interface annotationType {
  id: number;
  label: number;
  startOffset: number;
  endOffset: number;
}

// interface currentDocState {
//   id: number,
//   text: string,
//   annotations: annotationType[],
// }

interface singleAnnotationProp {
  labels: labelType[];
  text: string;
  annotationsDefault: annotationType[];
  list_id: number;
}

export default ({ labels, text, annotationsDefault, list_id }: singleAnnotationProp) => {
  const [annotations, setAnnotations] = useState<annotationType[]>(annotationsDefault);

  const removeEntity = (annotationId: number) => {
    const tmp = annotations.filter((item) => item.id !== annotationId);
    setAnnotations(tmp);
  };
  const updateEntity = (labelId: number, annotationId: number) => {
    const tmp = [...annotations];
    const index = annotations.findIndex((item) => item.id === annotationId);
    tmp[index].label = labelId;
    setAnnotations(tmp);
  };
  const addEntity = (startOffset: any, endOffset: any, labelId: any) => {
    const payload: annotationType = {
      id: Math.floor(Math.random() * Math.floor(Number.MAX_SAFE_INTEGER)),
      startOffset,
      endOffset,
      label: labelId,
    };
    setAnnotations([...annotations, payload]);
    // currentDoc.annotations.push(payload as annotationType)
  };

  return (
    <EntItemBox
      text={text}
      labels={labels}
      entities={annotations}
      deleteAnnotation={removeEntity}
      updateEntity={updateEntity}
      addEntity={addEntity}
      list_id={list_id}
    />
  );
};

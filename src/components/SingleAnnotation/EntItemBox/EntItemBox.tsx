import type { annotationType, labelType } from '../index';
import { useEffect, useState } from 'react';
import EntItem from '../EntItem/EntItem';
import 'antd/dist/antd.css';
import './index.css';
import { Dropdown, Menu } from 'antd';

interface EntItemBoxProps {
  labels: labelType[];
  text: string;
  entities: annotationType[];
  deleteAnnotation: (annotationId: number) => void;
  updateEntity: (labelId: number, annotationId: number) => void;
  addEntity: (start: number, end: number, labelId: number) => void;
}

interface chunkState {
  id?: number;
  label: string | null;
  color: string;
  text: string;
  newline?: boolean;
}

export default ({
  labels,
  text,
  entities,
  deleteAnnotation,
  updateEntity,
  addEntity,
}: EntItemBoxProps) => {
  const [renderChunks, setRenderChunks] = useState<chunkState[]>([]);
  const [position, setPosition] = useState({ start: 0, end: 0, x: 0, y: 0, showMenu: false });

  console.log('update', entities);

  const sortedEntities: () => annotationType[] = () => {
    return entities
      .slice()
      .sort(
        (a: { startOffset: number }, b: { startOffset: number }) => a.startOffset - b.startOffset,
      );
  };
  const labelObject: () => Record<string, { text: string; backgroundColor: string }> = () => {
    const obj: any = {};
    // eslint-disable-next-line no-restricted-syntax
    for (const label of labels) {
      obj[label.id] = label;
    }
    return obj;
  };
  const makeChunks = (rawText: string) => {
    const chunks = [];
    const snippets = rawText.split('\n');
    // eslint-disable-next-line no-restricted-syntax
    for (const snippet of snippets.slice(0, -1)) {
      chunks.push({
        label: null,
        color: null,
        text: `${snippet}\n`,
        newline: false,
      });
      chunks.push({
        label: null,
        color: null,
        text: '',
        newline: true,
      });
    }
    chunks.push({
      label: null,
      color: null,
      text: snippets.slice(-1)[0],
      newline: false,
    });
    return chunks;
  };
  const chunks: () => chunkState[] = () => {
    let inner_chunks: any[] = [];
    let startOffset = 0;
    // to count the number of characters correctly.
    const characters = [...text];
    // eslint-disable-next-line no-restricted-syntax
    for (const entity of sortedEntities()) {
      // add non-entities to chunks.
      let piece = characters.slice(startOffset, entity.startOffset).join('');
      inner_chunks = inner_chunks.concat(makeChunks(piece));
      startOffset = entity.endOffset;
      // add entities to chunks.
      const label = labelObject()[entity.label];
      piece = characters.slice(entity.startOffset, entity.endOffset).join('');
      inner_chunks.push({
        id: entity.id,
        label: label.text,
        color: label.backgroundColor,
        text: piece,
      });
    }
    // add the rest of text.
    inner_chunks = inner_chunks.concat(
      makeChunks(characters.slice(startOffset, characters.length).join('')),
    );
    return inner_chunks;
  };

  const setSpanInfo = (e: any) => {
    let selection;
    // Modern browsers.
    if (window.getSelection) {
      selection = window.getSelection();
    } else if (document.getSelection()) {
      selection = document.getSelection();
    }
    if (
      !selection ||
      e.target.className !== 'highlight-container highlight-container--bottom-labels'
    ) {
      return { start_: 0, end_: 0 };
    }

    const range = selection.getRangeAt(0);
    const preSelectionRange = range.cloneRange();
    preSelectionRange.selectNodeContents(e.target);
    preSelectionRange.setEnd(range.startContainer, range.startOffset);
    const start_tmp = [...preSelectionRange.toString()].length;
    const end_tmp = start_tmp + [...range.toString()].length;

    return { start_tmp, end_tmp };
  };
  const validateSpan = (start_: number | undefined = 0, end_: number | undefined = 0) => {
    if (typeof start_ === 'undefined' || typeof end_ === 'undefined' || end_ === 0) {
      setPosition({ ...position, showMenu: false });
      return false;
    }
    if (start_ === end_) {
      setPosition({ ...position, showMenu: false });
      return false;
    }
    // eslint-disable-next-line no-restricted-syntax
    for (const entity of entities) {
      if (entity.startOffset <= start_ && start_ < entity.endOffset) {
        return false;
      }
      if (entity.startOffset < end_ && end_ <= entity.endOffset) {
        return false;
      }
      if (start_ < entity.startOffset && entity.endOffset < end_) {
        return false;
      }
    }
    return true;
  };
  const show = (e: any, start_: number, end_: number) => {
    e.preventDefault();
    const tmp = {
      start: start_,
      end: end_,
      x: e.clientX || e.changedTouches[0].clientX,
      y: e.clientY || e.changedTouches[0].clientY,
      showMenu: true,
    };
    setPosition(tmp);
  };
  const handleOpen = (e: any) => {
    const deleteElem = e.path.filter((elem: any) => elem.className === 'delete');
    if (deleteElem.length !== 0) {
      const inner_id = Number(deleteElem[0].name.replace('close', ''));
      deleteAnnotation(inner_id);
    } else if (e.target.className === 'highlight__label') {
      console.log('open trigger', e);
    } else {
      const { start_tmp, end_tmp } = setSpanInfo(e);
      if (validateSpan(start_tmp, end_tmp) && start_tmp && end_tmp) {
        show(e, start_tmp, end_tmp);
      }
    }
  };

  useEffect(() => {
    setRenderChunks(chunks());
    const cls = document.getElementsByClassName(
      'highlight-container highlight-container--bottom-labels',
    );
    cls[0].addEventListener('mouseup', handleOpen);
    return () => {
      if (cls[0]) cls[0].removeEventListener('mouseup', handleOpen);
    };
  }, [entities]);

  // const assignLabel = (labelId: number) => {
  //     if (validateSpan()) {
  //         addEntity(start, end, labelId)
  //         setShowMenu(false)
  //         // setStart(0)
  //         // setEnd(0)
  //         x = 0
  //         y = 0
  //     }
  // }

  return (
    <div className={'highlight-container highlight-container--bottom-labels'}>
      {renderChunks.map((chunk) => {
        if (chunk.color)
          return (
            <EntItem
              key={chunk.id}
              labels={labels}
              label={chunk.label}
              color={chunk.color}
              content={chunk.text}
              updateEntity={updateEntity}
              item_id={chunk.id}
            />
          );
        return chunk.text;
      })}
      <Dropdown
        overlay={
          <Menu style={{ position: 'fixed', top: `${position.y}px`, left: `${position.x}px` }}>
            {labels.map((item) => (
              <Menu.Item
                key={item.id}
                onClick={() => {
                  addEntity(position.start, position.end, item.id);
                  setPosition({ ...position, showMenu: false });
                }}
              >
                {item.text}
              </Menu.Item>
            ))}
          </Menu>
        }
        placement="bottomLeft"
        visible={position.showMenu}
      >
        <div />
      </Dropdown>
    </div>
  );
};

'use client';

import { PropsWithChildren, useState } from 'react';

type DragAndDropProps = {
  handleDrop: (event: React.DragEvent<HTMLDivElement>) => void;
  children: (props: { isDragging: boolean }) => React.ReactNode;
};

export function DragAndDrop(props: DragAndDropProps) {
  const { children, handleDrop } = props;

  // not sure if i need this
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleDragEnter = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    setIsDragging(false);
  };

  // Handle the drop event
  const onDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    handleDrop(event);
  };

  return (
    <div
      onDrop={onDrop}
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
    >
      {children({ isDragging })}
    </div>
  );
}

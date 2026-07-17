export type MediaSlotValue = {
  src: string;
  alt: string;
  focalX: number;
  focalY: number;
  scale: number;
};

export function mediaImageStyle(slot: MediaSlotValue): React.CSSProperties {
  return {
    objectPosition: `${slot.focalX * 100}% ${slot.focalY * 100}%`,
    transform: slot.scale !== 1 ? `scale(${slot.scale})` : undefined,
  };
}

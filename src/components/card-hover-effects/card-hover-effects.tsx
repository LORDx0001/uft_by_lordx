import { cn } from "../../../lib/utils";
import { AnimatePresence, motion } from "motion/react";
import styles from "./card.module.scss";
import { useState } from "react";

export type Tool = {
  id: string;
  name: string;
  image: string;
};

export const HoverEffect = ({
  items,
  className,
}: {
  items: Tool[];
  className?: string;
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div className={cn(styles.card_wrapper, className)}>
      {items?.map((item, idx) => (
        <div
          key={item?.name}
          className="relative flex flex-col"
          onMouseEnter={() => setHoveredIndex(idx)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <AnimatePresence>
            {hoveredIndex === idx && (
              <motion.span
                className={cn(styles.motion_bg)}
                layoutId="hoverBackground"
                initial={{ opacity: 0 }}
                animate={{
                  opacity: 1,
                  transition: { duration: 0.1 },
                }}
                exit={{
                  opacity: 0,
                  transition: { duration: 0.1, delay: 0.2 },
                }}
              />
            )}
          </AnimatePresence>
          <Card>
            <CardImage img={item?.image} className="animate-float" />
            <CardTitle>{item.name}</CardTitle>
          </Card>
        </div>
      ))}
    </div>
  );
};

export const Card = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        styles.card,
        "dark:border-white/[0.2] border-[4px] group-hover:border-[#0a3c5c]",
        className
      )}
    >
      <div className={styles.card_inner}>{children}</div>
    </div>
  );
};

export const CardTitle = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return <h4 className={cn(styles.card_title, className)}>{children}</h4>;
};

export const CardImage = ({
  className,
  img,
}: {
  className?: string;
  img: string;
}) => {
  return (
    <p className={cn(styles.card_img, className)}>
      <img src={img} width={80} height={80} alt="card-img" />
    </p>
  );
};

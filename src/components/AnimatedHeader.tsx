interface AnimatedHeaderProps {
  text?: string;
  fontSize?: number;
  letterSpacing?: number;
}

export const AnimatedHeader = ({ 
  text = "Word Tree", 
  fontSize = 150,
  letterSpacing = 10 
}: AnimatedHeaderProps) => {
  return (
    <div className="w-full h-32 relative overflow-hidden">
      <svg width="100%" height="100%" className="absolute inset-0">
        <defs>
          <pattern 
            id="nature-dots" 
            x="0" 
            y="0" 
            width="100" 
            height="100"
            patternUnits="userSpaceOnUse"
          >
            <circle fill="hsl(var(--color-accent-secondary))" cx="25" cy="25" r="2" opacity="0.3" />
          </pattern>
          <style>
            {`
              @import url("https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&display=swap");
              
              .nature-text {
                font-family: 'Playfair Display', serif;
                letter-spacing: ${letterSpacing}px;
                stroke: hsl(var(--color-accent));
                font-size: clamp(2rem, 8vw, ${fontSize}px);
                font-weight: 700;
                stroke-width: 2;
                fill: hsl(var(--color-accent-secondary));
                animation: strokeFlow 8s linear infinite;
                user-select: text;
                -webkit-user-select: text;
                -moz-user-select: text;
                -ms-user-select: text;
              }
              
              @keyframes strokeFlow {
                0% {
                  stroke-dasharray: 20% 80%;
                  stroke-dashoffset: 0%;
                }
                
                100% {
                  stroke-dasharray: 20% 80%;
                  stroke-dashoffset: 100%;
                }
              }
              
              .dark .nature-text {
                fill: hsl(var(--color-accent-secondary));
                stroke: hsl(var(--color-accent));
              }
            `}
          </style>
        </defs>
        
        <rect x="0" y="0" width="100%" height="100%" fill="url(#nature-dots)" />
        
        <text 
          x="50%" 
          y="70%" 
          textAnchor="middle" 
          className="nature-text"
        >
          {text}
        </text>
      </svg>
    </div>
  );
};

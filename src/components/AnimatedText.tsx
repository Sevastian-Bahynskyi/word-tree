import React from 'react';

interface AnimatedTextProps {
    text?: string;
    fontSize?: number;
    letterSpacing?: number;
}

const AnimatedText: React.FC<AnimatedTextProps> = ({
    text = "Word Tree",
    fontSize = 150,
    letterSpacing = 10
}) => {
    return (
        <div className="w-full h-full bg-transparent m-0 p-0">
            <div className="h-full">
                <svg width="100%" height="100%" className="overflow-hidden">
                    <defs>                        <pattern
                        id="nature-dots"
                        x="0"
                        y="0"
                        width="100"
                        height="100"
                        patternUnits="userSpaceOnUse"
                    >
                        <circle fill="var(--color-accent)" fillOpacity="0.1" cx="25" cy="25" r="3" />
                    </pattern>
                        <style>
                            {`
                @import url("https://fonts.googleapis.com/css?family=Lora:400,400i,700,700i");
                
                .nature-text {
                  font-family: 'Lora', serif;
                  letter-spacing: ${letterSpacing}px;
                  stroke: var(--color-accent);
                  font-size: ${fontSize}px;
                  font-weight: 700;
                  stroke-width: 2;
                  fill: var(--color-accent-secondary);
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
              `}
                        </style>
                    </defs>

                    <rect x="0" y="0" width="100%" height="100%" fill="url(#nature-dots)" />

                    <text
                        x="50%"
                        y="60%"
                        textAnchor="middle"
                        className="nature-text"
                    >
                        {text}
                    </text>
                </svg>
            </div>
        </div>
    );
};

export default AnimatedText;

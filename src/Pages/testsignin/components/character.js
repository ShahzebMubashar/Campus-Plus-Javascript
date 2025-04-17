import { motion } from "framer-motion"

function Character({ mouseX, mouseY, isTypingPassword }) {
    // Calculate eye movement based on mouse position
    const calculateEyePosition = (baseX, baseY) => {
        if (isTypingPassword) return { x: baseX, y: baseY }

        // Limit eye movement range
        const maxMove = 3
        const eyeX = baseX + Math.min(Math.max((mouseX / window.innerWidth - 0.5) * 10, -maxMove), maxMove)
        const eyeY = baseY + Math.min(Math.max((mouseY / window.innerHeight - 0.5) * 10, -maxMove), maxMove)

        return { x: eyeX, y: eyeY }
    }

    const leftEyePosition = calculateEyePosition(125, 140)
    const rightEyePosition = calculateEyePosition(175, 140)

    return (
        <div className="character">
            <svg width="300" height="300" viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Body - more human-like */}
                <motion.g>
                    {/* Neck */}
                    <rect x="140" y="210" width="20" height="20" fill="#FFD8B9" />

                    {/* Shoulders */}
                    <path d="M120 230 L140 210 L160 210 L180 230 L180 250 L120 250 Z" fill="#4299e1" />

                    {/* Collar */}
                    <path d="M140 210 L150 220 L160 210" stroke="white" strokeWidth="2" fill="transparent" />
                </motion.g>

                {/* Face - more realistic */}
                <ellipse cx="150" cy="150" rx="60" ry="70" fill="#FFD8B9" />
                <path
                    d="M150 180 C120 180, 110 160, 110 140 C110 110, 130 90, 150 90 C170 90, 190 110, 190 140 C190 160, 180 180, 150 180 Z"
                    fill="#FFD8B9"
                />

                {/* Hair */}
                <path
                    d="M100 130 C100 100, 120 70, 150 70 C180 70, 200 100, 200 130 C200 120, 190 110, 180 110 C170 80, 130 80, 120 110 C110 110, 100 120, 100 130 Z"
                    fill="#8B4513"
                />
                <path d="M100 130 C100 120, 110 100, 120 100 C130 100, 120 120, 120 130 Z" fill="#8B4513" />
                <path d="M200 130 C200 120, 190 100, 180 100 C170 100, 180 120, 180 130 Z" fill="#8B4513" />

                {/* Graduation Hat */}
                <motion.g>
                    {/* Hat base */}
                    <rect x="90" y="70" width="120" height="10" fill="#333" />

                    {/* Hat top */}
                    <rect x="110" y="40" width="80" height="30" fill="#333" />

                    {/* Tassel */}
                    <rect x="180" y="40" width="5" height="40" fill="#FFD700" />
                    <circle cx="185" cy="85" r="5" fill="#FFD700" />

                    {/* Hat button */}
                    <circle cx="150" cy="40" r="5" fill="#FFD700" />
                </motion.g>

                {/* Eyes */}
                <g>
                    {isTypingPassword ? (
                        <>
                            {/* Hands covering eyes when typing password */}
                            <motion.path
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.3 }}
                                d="M110 140 Q130 120 150 140 Q170 120 190 140 Q170 160 150 140 Q130 160 110 140"
                                fill="#FFD8B9"
                                stroke="#333"
                                strokeWidth="2"
                            />
                            <motion.path
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.3 }}
                                d="M100 150 Q120 130 110 140 Q100 150 100 150"
                                fill="#FFD8B9"
                                stroke="#333"
                                strokeWidth="2"
                            />
                            <motion.path
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.3 }}
                                d="M200 150 Q180 130 190 140 Q200 150 200 150"
                                fill="#FFD8B9"
                                stroke="#333"
                                strokeWidth="2"
                            />
                        </>
                    ) : (
                        <>
                            {/* Eye whites - more human-like */}
                            <ellipse cx="125" cy="140" rx="15" ry="10" fill="white" stroke="#333" strokeWidth="1" />
                            <ellipse cx="175" cy="140" rx="15" ry="10" fill="white" stroke="#333" strokeWidth="1" />

                            {/* Pupils that follow mouse */}
                            <motion.circle
                                cx={leftEyePosition.x}
                                cy={leftEyePosition.y}
                                r="5"
                                fill="#333"
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            />
                            <motion.circle
                                cx={rightEyePosition.x}
                                cy={rightEyePosition.y}
                                r="5"
                                fill="#333"
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            />

                            {/* Eyebrows - more expressive */}
                            <path d="M110 125 Q125 120 140 125" stroke="#333" strokeWidth="2" fill="transparent" />
                            <path d="M160 125 Q175 120 190 125" stroke="#333" strokeWidth="2" fill="transparent" />

                            {/* Eyelids */}
                            <path d="M110 135 Q125 130 140 135" stroke="#333" strokeWidth="1" fill="transparent" />
                            <path d="M160 135 Q175 130 190 135" stroke="#333" strokeWidth="1" fill="transparent" />
                        </>
                    )}
                </g>

                {/* Nose - more realistic */}
                <path d="M145 145 Q150 155 155 145" stroke="#FFCCA9" strokeWidth="1" fill="#FFCCA9" />
                <path d="M150 145 L150 160" stroke="#FFCCA9" strokeWidth="1" fill="transparent" />

                {/* Mouth - more realistic */}
                <path d="M130 170 Q150 180 170 170" stroke="#333" strokeWidth="2" fill="transparent" />

                {/* Cheeks */}
                <circle cx="120" cy="160" r="10" fill="#FFAAA9" opacity="0.3" />
                <circle cx="180" cy="160" r="10" fill="#FFAAA9" opacity="0.3" />

                {/* Ears */}
                <path d="M90 140 Q85 150 90 160 Q95 165 100 160 Q105 150 100 140 Z" fill="#FFD8B9" />
                <path d="M210 140 Q215 150 210 160 Q205 165 200 160 Q195 150 200 140 Z" fill="#FFD8B9" />
            </svg>
        </div>
    )
}

export default Character

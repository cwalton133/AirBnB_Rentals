// Step 8: Create a reusable Card component
// src/components/Card.tsx

import React from 'react'

interface CardProps {
  title: string;
  description: string;
  buttonText?: string;
  buttonVariant?: string;
  onButtonClick?: () => void;
}

const Card: React.FC<CardProps> = ({
  title,
  description,
  buttonText = 'Learn More',
  buttonVariant = 'primary',
  onButtonClick
}) => {
  return (
    <div className="card h-100">
      <div className="card-body">
        <h5 className="card-title">{title}</h5>
        <p className="card-text">{description}</p>
        {onButtonClick && (
          <button 
            className={`btn btn-${buttonVariant}`} 
            onClick={onButtonClick}
          >
            {buttonText}
          </button>
        )}
      </div>
    </div>
  )
}

export default Card
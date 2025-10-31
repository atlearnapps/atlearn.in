import React from 'react'

function TagLabel({text}) {
  return (
    <span className="text-sm font-semibold text-primaryColor bg-whitegrey3 px-6 py-5px mb-5 rounded-full inline-block">
               {text}
              </span>
  )
}

export default TagLabel

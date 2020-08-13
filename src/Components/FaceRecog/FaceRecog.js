import React from 'react'
import './FaceRecog.css'

const FaceRecog = ({ imgUrl, box }) => {
  return (
    <div className='center ma'>
        <div className='absolute mt2'>
            <img id='inputImage' alt='' src={imgUrl} width='500px' height='auto'/>
            <div className="bounding-box" style={{top: box.topRow, left: box.leftCol, height: box.height, width: box.width}}></div>
      </div>
    </div>
  )
}

export default FaceRecog
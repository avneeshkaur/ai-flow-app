import { useState } from 'react'
import { Handle, Position } from '@xyflow/react'

function InputNode({ data }) {
  const [val, setVal] = useState('')

  function handleType(e) {
    setVal(e.target.value)
    data.onPromptChange(e.target.value)
  }

  return (
    <div className="flow-node input-node">
      <div className="node-header">Input</div>
      <div className="node-body">
        <textarea
          rows={4}
          placeholder="Type your prompt here..."
          value={val}
          onChange={handleType}
          className="prompt-textarea"
        />
      </div>
      <Handle type="source" position={Position.Right} />
    </div>
  )
}

export default InputNode

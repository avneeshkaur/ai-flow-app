import { Handle, Position } from '@xyflow/react'

function ResultNode({ data }) {
  let content

  if (data.loading) {
    content = <p className="loading-text">Thinking...</p>
  } else if (data.response) {
    content = <p className="response-text">{data.response}</p>
  } else {
    content = <p className="placeholder-text">AI response will appear here</p>
  }

  return (
    <div className="flow-node result-node">
      <Handle type="target" position={Position.Left} />
      <div className="node-header">Result</div>
      <div className="node-body">{content}</div>
    </div>
  )
}

export default ResultNode

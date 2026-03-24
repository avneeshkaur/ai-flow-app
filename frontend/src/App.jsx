import { useState, useEffect, useCallback } from 'react'
import {
  ReactFlow,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  Background
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import axios from 'axios'
import InputNode from './nodes/InputNode'
import ResultNode from './nodes/ResultNode'

const nodeTypes = {
  inputNode: InputNode,
  resultNode: ResultNode
}

const initNodes = [
  {
    id: '1',
    type: 'inputNode',
    position: { x: 80, y: 150 },
    data: { prompt: '', onPromptChange: () => {} }
  },
  {
    id: '2',
    type: 'resultNode',
    position: { x: 500, y: 150 },
    data: { response: '', loading: false }
  }
]

const initEdges = [
  {
    id: 'e1-2',
    source: '1',
    target: '2',
    animated: true,
    style: { stroke: '#6366f1' }
  }
]

export default function App() {
  const [prompt, setPrompt] = useState('')
  const [response, setResponse] = useState('')
  const [loading, setLoading] = useState(false)
  const [saveMsg, setSaveMsg] = useState('')
  const [history, setHistory] = useState([])
  const [showHistory, setShowHistory] = useState(false)

  const [nodes, setNodes, onNodesChange] = useNodesState(initNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initEdges)

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  )

  // wire up the prompt callback on mount
  useEffect(() => {
    setNodes((prev) =>
      prev.map((n) => {
        if (n.id === '1') {
          return { ...n, data: { ...n.data, onPromptChange: setPrompt } }
        }
        return n
      })
    )
  }, [])

  function updateResult(text, isLoading) {
    setNodes((prev) =>
      prev.map((n) => {
        if (n.id === '2') {
          return { ...n, data: { response: text, loading: isLoading } }
        }
        return n
      })
    )
  }

  async function runFlow() {
    if (!prompt.trim()) return

    setSaveMsg('')
    setLoading(true)
    setResponse('')
    updateResult('', true)

    try {
      const res = await axios.post('/api/ask-ai', { prompt })
      setResponse(res.data.response)
      updateResult(res.data.response, false)
    } catch (err) {
      const msg = 'Something went wrong, try again.'
      setResponse(msg)
      updateResult(msg, false)
    }

    setLoading(false)
  }

  async function saveResult() {
    if (!prompt.trim() || !response) {
      setSaveMsg('Run the flow first!')
      return
    }

    try {
      await axios.post('/api/save', { prompt, response })
      setSaveMsg('Saved!')
    } catch {
      setSaveMsg('Save failed.')
    }
  }

  async function loadHistory() {
    try {
      const res = await axios.get('/api/history')
      setHistory(res.data)
      setShowHistory(true)
    } catch {
      alert('Could not load history')
    }
  }

  return (
    <div className="app-wrapper">
      <header className="app-header">
        <h1>AI Flow</h1>
        <p>Type a prompt in the input node and click Run Flow to get a response</p>
      </header>

      <div className="flow-container">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
        >
          <Background color="#e2e8f0" gap={20} />
          <Controls />
        </ReactFlow>
      </div>

      <div className="action-bar">
        <button
          className="btn btn-primary"
          onClick={runFlow}
          disabled={loading || !prompt.trim()}
        >
          {loading ? 'Running...' : 'Run Flow'}
        </button>
        <button
          className="btn btn-secondary"
          onClick={saveResult}
          disabled={!response || loading}
        >
          Save
        </button>
        <button className="btn btn-outline" onClick={loadHistory}>
          View History
        </button>
        {saveMsg && <span className="save-status">{saveMsg}</span>}
      </div>

      {showHistory && (
        <div className="history-panel">
          <div className="history-header">
            <h2>Saved History</h2>
            <button className="close-btn" onClick={() => setShowHistory(false)}>✕</button>
          </div>
          {history.length === 0 ? (
            <p className="empty-msg">Nothing saved yet.</p>
          ) : (
            history.map((item) => (
              <div key={item._id} className="history-item">
                <p className="history-prompt"><strong>Prompt:</strong> {item.prompt}</p>
                <p className="history-response"><strong>Response:</strong> {item.response}</p>
                <p className="history-date">{new Date(item.savedAt).toLocaleString()}</p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}

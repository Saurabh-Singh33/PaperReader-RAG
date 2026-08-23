import { useState } from 'react'
import { useAuth } from '@clerk/clerk-react'
import { ArrowUp, BookOpen, LoaderCircle, MessageCircle } from 'lucide-react'
import { askQuestion } from '../lib/api'

export default function Chat({ documentName }) {
  const { getToken } = useAuth()
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')
  const [sources, setSources] = useState([])
  const [loading, setLoading] = useState(false)
  const submit = async (event) => {
    event?.preventDefault()
    if (!question.trim() || loading) return
    setLoading(true)
    try {
      const token = await getToken()
      const result = await askQuestion(question.trim(), token)
      setAnswer(result.answer || result.message)
      setSources(result.sources || [])
      setQuestion('')
    } catch (error) {
      setAnswer(`I couldn't reach your paper: ${error.message}`)
      setSources([])
    } finally { setLoading(false) }
  }

  return (
    <section className="panel chat-panel">
      <div className="panel-heading">
        <div><p className="eyebrow">02 / Ask anything</p><h2>Make the paper talk.</h2></div>
        <span className="icon-disc icon-disc-light"><MessageCircle size={19} /></span>
      </div>
      <p className="panel-copy">Ask for a summary, challenge an argument, or find the exact thread you need.</p>
      <div className="suggestions">
        {['What is the central argument?', 'Summarize the methodology', 'What are the limitations?'].map((item) => <button key={item} type="button" onClick={() => setQuestion(item)}>{item}</button>)}
      </div>
      <form className="question-form" onSubmit={submit}>
        <input value={question} onChange={(event) => setQuestion(event.target.value)} placeholder="Ask your paper a question..." aria-label="Question" />
        <button className="send-button" type="submit" disabled={loading || !question.trim()} aria-label="Send question">{loading ? <LoaderCircle className="spin" size={18} /> : <ArrowUp size={18} />}</button>
      </form>
      {answer ? <div className="answer-block"><div className="answer-label"><span className="answer-mark">✦</span> PaperReader's answer {documentName && <span className="document-tag"><BookOpen size={12} /> {documentName}</span>}</div><p className="answer-text">{answer}</p>{sources.length > 0 && <div className="sources"><span>Sources</span>{sources.map((source, index) => <div className="source" key={`${source}-${index}`}>{source}</div>)}</div>}</div> : <div className="empty-chat"><BookOpen size={22} /><span>Your answer will appear here, grounded in the text.</span></div>}
    </section>
  )
}

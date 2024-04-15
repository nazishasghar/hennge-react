import { useEffect, useRef, useState } from 'react'
import { styled } from 'styled-components'
import RecipientsBadge from './RecipientsBadge'

type RecipientsDisplayProps = {
  recipients: string[]
}
const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  overflow: hidden;
`
const RecipientsTooltip = styled.div`
  position: fixed;
  top: 8px;
  right: 8px;
  padding: 8px 16px;
  background-color: #666;
  color: #f0f0f0;
  border-radius: 24px;
  display: flex;
  align-items: center;
`

const RecipientsDisplay: React.FC<RecipientsDisplayProps> = ({
  recipients,
}) => {
  const [displayedRecipients, setDisplayedRecipients] = useState<string[]>([])
  const [trimmedCount, setTrimmedCount] = useState<number>(0)
  const [showTooltip, setShowTooltip] = useState<boolean>(false)
  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const updateDisplayedRecipients = () => {
      if (!containerRef.current) return

      const containerWidth = containerRef.current.clientWidth
      let totalWidth = 0
      let displayed: string[] = []
      let trimmed = 0

      recipients.some((recipient, index) => {
        const recipientWidth = getTextWidth(recipient)
        if (totalWidth + recipientWidth <= containerWidth || index === 0) {
          displayed.push(recipient)
          totalWidth += recipientWidth
        } else {
          trimmed = recipients.length - index
          return true
        }
        return false
      })

      setDisplayedRecipients(displayed)
      setTrimmedCount(trimmed)
    }

    const getTextWidth = (text: string) => {
      const span = document.createElement('span')
      span.textContent = text
      span.style.visibility = 'hidden'
      document.body.appendChild(span)
      const width = span.offsetWidth
      document.body.removeChild(span)
      return width
    }

    updateDisplayedRecipients()

    window.addEventListener('resize', updateDisplayedRecipients)

    return () => {
      window.removeEventListener('resize', updateDisplayedRecipients)
    }
  }, [recipients])

  const handleBadgeHover = (hovering: boolean) => {
    setShowTooltip(hovering)
  }

  return (
    <Container ref={containerRef}>
      <div>
        {displayedRecipients.map((recipient, index) => (
          <span key={index}>
            {recipient}
            {index !== displayedRecipients.length - 1 && ', '}
          </span>
        ))}
        {trimmedCount > 0 && <> , ...</>}
      </div>

      <div>
        {trimmedCount > 0 && (
          <RecipientsBadge
            numTruncated={trimmedCount}
            onMouseEnter={() => handleBadgeHover(true)}
            onMouseLeave={() => handleBadgeHover(false)}
          />
        )}
      </div>
      {showTooltip && (
        <RecipientsTooltip>{recipients.join(', ')}</RecipientsTooltip>
      )}
    </Container>
  )
}

export default RecipientsDisplay

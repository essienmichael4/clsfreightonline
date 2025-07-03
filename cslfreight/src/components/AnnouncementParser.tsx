import parse from 'html-react-parser'
interface AnnouncementParserProps {
    announcement:string
}

const AnnouncementParser = ({announcement}:AnnouncementParserProps) => {
  return (
    <div className="prose prose-sm mt-3 focus:outline-none">
        {parse(announcement)}
    </div>
  )
}

export default AnnouncementParser

import './LessonExplorer.css';

export default function LessonExplorer() {
  const [selectedChapter, setSelectedChapter] = useState(null);

  return (
    <div className="lesson-container">
      {/* 📚 Sidebar with lesson structure */}
      <div className="sidebar">
        <h2 className="text-lg font-semibold mb-4">{mockLesson.title}</h2>
        <SidebarTree
          data={mockLesson.terms}
          onSelectChapter={setSelectedChapter}
        />
      </div>

      {/* 📖 Chapter Content Panel */}
      <div className="content-panel">
        {selectedChapter ? (
          <ChapterContent chapter={selectedChapter} />
        ) : (
          <p className="text-gray-500">Select a chapter to view its content.</p>
        )}
      </div>
    </div>
  );
}
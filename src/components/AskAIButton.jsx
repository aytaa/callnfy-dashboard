import { Sparkles } from 'lucide-react';

export default function AskAIButton() {
  const handleClick = () => {
    // Future: Open AI chat modal
    console.log('Ask AI clicked');
  };

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-6 right-6 z-40 flex items-center gap-2 px-4 py-3 bg-[#1a1a1a] hover:bg-[#2a2a2a] text-white rounded-full shadow-lg transition-all duration-200 hover:shadow-xl"
    >
      <Sparkles className="w-5 h-5" strokeWidth={1.5} />
      <span className="text-sm font-medium">Ask AI</span>
    </button>
  );
}

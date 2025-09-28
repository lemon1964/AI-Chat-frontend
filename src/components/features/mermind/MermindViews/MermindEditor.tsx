export default function MermindEditor({
    code,
    setCode,
  }: {
    code: string;
    setCode: (v: string) => void;
  }) {
    return (
      <>
        <h3 className="mt-4 font-medium">Код</h3>
        <textarea
          className="w-full h-56 p-3 border rounded mt-2 font-mono text-sm"
          value={code}
          onChange={e => setCode(e.target.value)}
        />
      </>
    );
  }
  
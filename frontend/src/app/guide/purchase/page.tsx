export default function GuidePurchase() {
  const Step = ({ n, text }: { n: number; text: string }) => (
    <div className="rounded-2xl border bg-white p-6">
      <div className="text-6xl">{n}</div>
      <p className="mt-4 text-sm text-slate-600">{text}</p>
    </div>
  );
  return (
    <>
      <h2 className="text-2xl font-bold mb-6">SNP 구매하기</h2>
      <div className="grid md:grid-cols-4 gap-6">
        <Step n={1} text="메뉴에서 ‘구매하기’를 클릭합니다." />
        <Step n={2} text="패키지에서 ‘추가’를 누릅니다." />
        <Step n={3} text="체크아웃에서 QR 코드를 스캔합니다." />
        <Step n={4} text="금액과 주소를 확인하고 전송합니다." />
      </div>
    </>
  );
}

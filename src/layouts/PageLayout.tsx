export default function PageLayout({children}: any) {
  return (
    <main className="w-full min-h-screen flex flex-1 flex-col justify-center items-center">
      {children}
    </main>
  );
}

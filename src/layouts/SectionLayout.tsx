export default function SectionLayout({children}: any) {
  return (
    <section className="w-full min-h-screen flex flex-1 flex-col justify-center items-center">
      {children}
    </section>
  );
}

export default function SectionLayout({children}: any) {
  return (
    <section className="w-full h-screen flex flex-1 flex-col justify-center items-center">
      {children}
    </section>
  );
}

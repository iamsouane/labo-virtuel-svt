import Navbar from './Navbar';

type Props = {
  children: React.ReactNode;
};

const MainLayout = ({ children }: Props) => (
  <>
    <Navbar />
    <main className="pt-20">{children}</main>
  </>
);

export default MainLayout;
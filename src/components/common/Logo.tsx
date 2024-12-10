import { Images } from '@/lib/images';
import Image from 'next/image';

interface LogoProps {
  className?: string;
}

export default function Logo({ className = '' }: LogoProps) {
  return (
    <div className={className}>
      <Image src={Images.Logo} alt="Denning Logo" width={300} height={75} />

    </div>
  );
} 
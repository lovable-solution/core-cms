import { redirect } from 'next/navigation';

export default function AdminIndexPage() {
  redirect('/admin/edit?locale=en&path=%2F');
}

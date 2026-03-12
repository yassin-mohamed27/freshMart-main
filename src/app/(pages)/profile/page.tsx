import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { redirect } from "next/navigation";
import ProfileClient from "@/components/Profile/ProfileClient";
import { getUserAddressesAction } from "@/actions/address.actions";

export default async function ProfilePage() {
    const session = await getServerSession(authOptions);
    if (!session) redirect("/login");

    const user = (session as any)?.user || null; // name/email
    const addressesRes = await getUserAddressesAction(); // {data: []}

    return <ProfileClient user={user} addressesRes={addressesRes} />;
}

import { createClient } from "@/utils/supabase/server";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { updateProfile, updatePassword } from "./actions";
import { SettingsForm } from "./SettingsForm";
import { User, Lock, Users } from "lucide-react";

function SectionCard({
  title,
  description,
  icon: Icon,
  children,
}: {
  title: string;
  description: string;
  icon: React.ElementType;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white shadow-sm overflow-hidden">
      <div className="border-b border-zinc-100 px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-100 text-zinc-600">
            <Icon size={18} />
          </div>
          <div>
            <h2 className="text-base font-semibold text-zinc-900">{title}</h2>
            <p className="text-sm text-zinc-500">{description}</p>
          </div>
        </div>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

function FormField({
  label,
  id,
  name,
  type = "text",
  placeholder,
  defaultValue,
}: {
  label: string;
  id: string;
  name: string;
  type?: string;
  placeholder?: string;
  defaultValue?: string;
}) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="text-sm font-medium text-zinc-700">
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        placeholder={placeholder}
        defaultValue={defaultValue}
        className="w-full rounded-xl border border-zinc-300 px-4 py-2.5 text-sm outline-none transition-all focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900"
      />
    </div>
  );
}

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const displayName = user?.user_metadata?.display_name ?? "";
  const email = user?.email ?? "";

  let allUsers: any[] = [];
  if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
    const adminSupabase = createSupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );
    const { data: { users }, error } = await adminSupabase.auth.admin.listUsers();
    if (!error && users) {
      allUsers = users;
    }
  }

  // Fallback to active user if no service key
  if (allUsers.length === 0 && user) {
    allUsers = [user];
  }

  return (
    <div className="p-6 md:p-8 max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Settings</h1>
        <p className="mt-1 text-sm text-zinc-500">Manage your admin account.</p>
      </div>

      <div className="space-y-8">

        {/* Profile Section */}
        <SectionCard
          title="Profile"
          description="Update your display name."
          icon={User}
        >
          <SettingsForm action={updateProfile} submitLabel="Save Profile">
            <FormField
              label="Display Name"
              id="display_name"
              name="display_name"
              placeholder="e.g. Store Admin"
              defaultValue={displayName}
            />
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-700">Email Address</label>
              <input
                type="email"
                value={email}
                disabled
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-sm text-zinc-400 cursor-not-allowed"
              />
              <p className="text-xs text-zinc-400">Email address cannot be changed here.</p>
            </div>
          </SettingsForm>
        </SectionCard>

        {/* Password Section */}
        <SectionCard
          title="Change Password"
          description="Choose a strong password for your account."
          icon={Lock}
        >
          <SettingsForm action={updatePassword} submitLabel="Update Password">
            <FormField
              label="New Password"
              id="new_password"
              name="new_password"
              type="password"
              placeholder="Minimum 6 characters"
            />
            <FormField
              label="Confirm New Password"
              id="confirm_password"
              name="confirm_password"
              type="password"
              placeholder="Re-enter your new password"
            />
          </SettingsForm>
        </SectionCard>

        {/* Admins Section */}
        <SectionCard
          title="Available Admins"
          description="People who have access to manage this dashboard."
          icon={Users}
        >
          <div className="space-y-4">
            {allUsers.map((u) => {
              const isYou = u.id === user?.id;
              const uDisplayName = u.user_metadata?.display_name || "";
              const uEmail = u.email || "";
              
              return (
                <div key={u.id} className="flex items-center justify-between rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-bold">
                      {uDisplayName ? uDisplayName.charAt(0).toUpperCase() : uEmail.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-zinc-900">
                        {uDisplayName || "Unnamed Admin"} 
                        {isYou && (
                          <span className="ml-2 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700">YOU</span>
                        )}
                      </p>
                      <p className="text-xs text-zinc-500">{uEmail}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </SectionCard>

      </div>
    </div>
  );
}

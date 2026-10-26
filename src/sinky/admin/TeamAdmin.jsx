import { useState } from "react";
import { useApp } from "../store.jsx";
import { Btn, Icon, Img, Modal, Confirm } from "../ui.jsx";

export function TeamAdmin() {
  const { data, upsert, remove, notify } = useApp();
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const team = data.team || [];

  const openNew = () => {
    setEditing({
      id: `d-${Date.now().toString(36)}`,
      name: "",
      role: "Director / Promoter",
      bio: "",
      image: "",
    });
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!editing.name.trim() || !editing.role.trim()) return;
    upsert("team", editing, "team profile");
    notify(`Profile for "${editing.name}" saved.`);
    setEditing(null);
  };

  const handleDelete = () => {
    if (!deleting) return;
    remove("team", deleting.id, "team profile");
    notify("Profile removed.");
    setDeleting(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-line pb-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-forest">Directors & Promoters</h2>
          <p className="text-xs text-muted-foreground">
            Manage executive leadership profiles featured on the About Us page.
          </p>
        </div>
        <Btn onClick={openNew} className="btn-sm">
          <Icon name="plus" className="h-4 w-4" />
          Add Director
        </Btn>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {team.map((member) => (
          <div key={member.id} className="card p-5 flex items-start gap-4">
            {member.image ? (
              <div className="h-16 w-16 shrink-0 overflow-hidden rounded-full border border-line">
                <Img src={member.image} alt={member.name} className="h-full w-full object-cover" />
              </div>
            ) : (
              <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-forest font-serif text-2xl text-cream font-bold">
                {member.name[0]}
              </span>
            )}

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-serif text-base font-bold text-forest">{member.name}</h3>
                  <p className="text-xs font-semibold text-terracotta">{member.role}</p>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setEditing({ ...member })}
                    className="rounded-lg p-1 text-muted-foreground hover:bg-sage hover:text-forest"
                  >
                    <Icon name="edit" className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setDeleting(member)}
                    className="rounded-lg p-1 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                  >
                    <Icon name="trash" className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <p className="mt-2 text-xs text-ink/75 leading-relaxed">{member.bio}</p>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <Modal
          open={true}
          onClose={() => setEditing(null)}
          title={editing.name ? `Edit Profile: ${editing.name}` : "Add Director Profile"}
        >
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-ink/75">
                Full Name <span className="text-terracotta">*</span>
              </label>
              <input
                className="input mt-1"
                value={editing.name}
                onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                placeholder="e.g. Akhilesh Harsh Pandey"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-ink/75">
                Designation / Role <span className="text-terracotta">*</span>
              </label>
              <input
                className="input mt-1"
                value={editing.role}
                onChange={(e) => setEditing({ ...editing, role: e.target.value })}
                placeholder="e.g. Director / Promoter"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-ink/75">
                Photo Image URL (Optional)
              </label>
              <input
                className="input mt-1"
                value={editing.image}
                onChange={(e) => setEditing({ ...editing, image: e.target.value })}
                placeholder="Leave blank for automatic initial avatar"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-ink/75">
                Executive Biography <span className="text-terracotta">*</span>
              </label>
              <textarea
                rows={3}
                className="input mt-1"
                value={editing.bio}
                onChange={(e) => setEditing({ ...editing, bio: e.target.value })}
                placeholder="Brief summary of leadership focus and background..."
                required
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-line">
              <Btn type="button" variant="ghost" onClick={() => setEditing(null)}>
                Cancel
              </Btn>
              <Btn type="submit">Save Profile</Btn>
            </div>
          </form>
        </Modal>
      )}

      <Confirm
        open={!!deleting}
        title="Delete Director Profile?"
        message={`Are you sure you want to remove ${deleting?.name}'s profile?`}
        confirmLabel="Delete Profile"
        onConfirm={handleDelete}
        onCancel={() => setDeleting(null)}
      />
    </div>
  );
}

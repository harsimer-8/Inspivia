import { NextRequest, NextResponse } from "next/server";
import { backendRequest, jsonError, type BackendResult } from "@/lib/server/backend";
import { AUTH_PATHS, toSessionUser, type StudentProfileResponse } from "@/lib/server/authContract";
import { withSession } from "@/lib/server/proxy";

export const dynamic = "force-dynamic";

interface MeBundle {
  me: unknown;
  profile: StudentProfileResponse | null;
}

export async function GET(req: NextRequest) {
  return withSession<MeBundle>(
    req,
    async (token): Promise<BackendResult<MeBundle>> => {
      const me = await backendRequest(AUTH_PATHS.me, { token });
      if (!me.ok) return { ...me, data: null };
      // Course / year / domain come from the student profile. It is optional: mentors and admins
      // have none (403), so any failure here just means "no profile details", never a failed sign-in.
      const profile = await backendRequest<StudentProfileResponse>(AUTH_PATHS.studentProfile, { token });
      if (profile.status === 401) return { ...profile, data: null };
      return { ok: true, status: 200, data: { me: me.data, profile: profile.ok ? profile.data : null } };
    },
    (result) => {
      const user = toSessionUser(result.data?.me, result.data?.profile);
      if (!user) return jsonError(502, "Could not load your account. Please try again.", "BAD_UPSTREAM_RESPONSE");
      return NextResponse.json({ authenticated: true, user });
    }
  );
}

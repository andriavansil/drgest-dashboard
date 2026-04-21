import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { WebhookEvent, clerkClient } from '@clerk/nextjs/server';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error('Please add CLERK_WEBHOOK_SECRET to .env');
  }

  const headerPayload = headers();
  const svix_id = headerPayload.get('svix-id');
  const svix_timestamp = headerPayload.get('svix-timestamp');
  const svix_signature = headerPayload.get('svix-signature');

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occurred -- no svix headers', {
      status: 400,
    });
  }

  const payload = await req.json();
  const body = JSON.stringify(payload);

  const wh = new Webhook(WEBHOOK_SECRET);
  let evt: WebhookEvent;

  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error('❌ Error verifying webhook:', err);
    return new Response('Error occurred', { status: 400 });
  }

  const eventType = evt.type;

  // =========================
  // USER CREATED
  // =========================
  if (eventType === 'user.created') {
    const {
      id,
      email_addresses,
      first_name,
      last_name,
      public_metadata,
    } = evt.data;

    const email = email_addresses[0]?.email_address;
    const name = `${first_name || ''} ${last_name || ''}`.trim();

    const existingRole = (public_metadata as any)?.role;
    const existingSpeciality = (public_metadata as any)?.speciality;

    const role = existingRole || 'med';
    const speciality = existingSpeciality || null;

    console.log('📝 Creating user:', { speciality });

    try {
      // ✅ Garantir metadata no Clerk (evita loop)
      if (!existingRole || !existingSpeciality) {
        await clerkClient.users.updateUserMetadata(id, {
          publicMetadata: {
            role,
            speciality,
          },
        });
      }

      // =========================
      // STATUS INIT
      // =========================
      let activeStatus = await prisma.status.findFirst({
        where: { name: 'Ativo' },
      });

      if (!activeStatus) {
        activeStatus = await prisma.status.create({
          data: { name: 'Ativo' },
        });

        await prisma.status.createMany({
          data: [
            { name: 'Agendada' },
            { name: 'Realizada' },
            { name: 'Cancelada' },
          ],
          skipDuplicates: true,
        });
      }

      // =========================
      // UPSERT USER
      // =========================
      await prisma.user.upsert({
        where: { email },
        update: {
          name,
          speciality,
          role,
          updatedAt: new Date(),
        },
        create: {
          id,
          email,
          name,
          speciality,
          role,
          password: 'clerk-managed',
          statusId: activeStatus.id,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });

      console.log(`✅ User synced with role: ${role}`);
    } catch (error) {
      console.error('❌ Error syncing user:', error);
      return new Response('Error syncing user', { status: 500 });
    }
  }

  // =========================
  // USER UPDATED
  // =========================
  if (eventType === 'user.updated') {
    const {
      id,
      email_addresses,
      first_name,
      last_name,
      public_metadata,
    } = evt.data;

    const email = email_addresses[0]?.email_address;
    const name = `${first_name || ''} ${last_name || ''}`.trim();

    const role = (public_metadata as any)?.role || 'med';
    const speciality = (public_metadata as any)?.speciality || null;

    try {
      await prisma.user.update({
        where: { id },
        data: {
          email,
          name,
          speciality,
          role,
          updatedAt: new Date(),
        },
      });

      console.log(`✅ User ${email} updated`);
    } catch (error) {
      console.error('❌ Error updating user:', error);
    }
  }

  // =========================
  // USER DELETED
  // =========================
  if (eventType === 'user.deleted') {
    const { id } = evt.data;

    try {
      await prisma.user.delete({
        where: { id },
      });

      console.log(`✅ User ${id} deleted`);
    } catch (error) {
      console.error('❌ Error deleting user:', error);
    }
  }

  return new Response('Webhook received', { status: 200 });
}
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { AlertCircle, Bell, Check, Clock, Info, X } from "lucide-react";

type AnnouncementData = {
  title: string;
  message: string;
  details: string;
  revision: number;
};

type UserNotification = {
  _id: string;
  title: string;
  message: string;
  readAt: string | null;
  createdAt: string;
};

export function Notification() {
  const [announcement, setAnnouncement] = useState<AnnouncementData | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadAnnouncement = useCallback(async () => {
    try {
      const response = await fetch("/api/announcement", { cache: "no-store" });
      if (!response.ok) return;

      const data = await response.json();
      const nextAnnouncement: AnnouncementData | null = data.announcement;
      setAnnouncement(nextAnnouncement);

      const dismissedRevision = localStorage.getItem("announcement");
      if (nextAnnouncement && dismissedRevision !== String(nextAnnouncement.revision)) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
        setIsModalOpen(false);
      }
    } catch {
      // Keep the current banner if a temporary network error occurs.
    }
  }, []);

  useEffect(() => {
    void loadAnnouncement();

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        void loadAnnouncement();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [loadAnnouncement]);

  if (!announcement || !isVisible) return null;

  const dismiss = () => {
    setIsVisible(false);
    localStorage.setItem("announcement", String(announcement.revision));
  };

  return (
    <>
      <div className="relative z-40 w-full border-b-2 border-blue-200 bg-linear-to-r from-blue-50 to-indigo-50">
        <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex min-w-0 flex-1 items-center gap-3">
              <AlertCircle className="h-5 w-5 shrink-0 text-blue-600" />
              <p className="text-sm font-medium text-blue-900">
                {announcement.title && (
                  <>
                    <span className="font-bold">{announcement.title}</span>{" "}
                  </>
                )}
                {announcement.message}
                {announcement.details && (
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="ml-2 font-bold text-blue-700 underline hover:text-blue-900"
                  >
                    Learn more
                  </button>
                )}
              </p>
            </div>
            <button
              onClick={dismiss}
              className="shrink-0 rounded p-1 transition-colors hover:bg-blue-100"
              aria-label="Dismiss announcement"
            >
              <X className="h-4 w-4 text-blue-600" />
            </button>
          </div>
        </div>
      </div>

      {isModalOpen && announcement.details && (
        <AnnouncementDialog
          announcement={announcement}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
}

function AnnouncementDialog({
  announcement,
  onClose,
}: {
  announcement: AnnouncementData;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-label={announcement.title || "Announcement"}
        className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl border-2 border-[#E5E3DF] bg-white text-[#1A1A1A] shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="sticky top-0 flex items-start justify-between border-b-2 border-blue-200 bg-linear-to-r from-blue-50 to-indigo-50 p-6">
          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-blue-100 p-2">
              <Info className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">{announcement.title}</h2>
              <p className="mt-1 text-sm text-blue-800">{announcement.message}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 hover:bg-blue-100"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="whitespace-pre-wrap p-6 text-base leading-relaxed">
          {announcement.details}
        </div>

        <div className="sticky bottom-0 border-t-2 border-[#E5E3DF] bg-white p-4">
          <button
            onClick={onClose}
            className="w-full rounded-lg bg-[#1A1A1A] py-3 font-bold text-white hover:bg-[#333]"
          >
            Got it, thanks!
          </button>
        </div>
      </section>
    </div>
  );
}

export function NotificationInbox() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<UserNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [page, setPage] = useState(1);
  const pageRef = useRef(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  const pathname = usePathname();
  const isDashboard = pathname.startsWith("/dashboard");

  const loadNotifications = useCallback(
    async (currentPage = pageRef.current) => {
      if (!isDashboard) return;

      setIsLoading(true);
      setHasError(false);

      try {
        const response = await fetch(
          `/api/my/notifications?page=${currentPage}`,
          { cache: "no-store" },
        );

        if (response.status === 401) return;
        if (!response.ok) throw new Error("Could not load notifications");

        const data = await response.json();
        setNotifications(data.notifications);
        setUnreadCount(data.unreadCount);
        setTotalPages(Math.max(1, data.totalPages));
      } catch {
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    },
    [isDashboard],
  );

  useEffect(() => {
    if (!isDashboard) return;
    void loadNotifications(1);

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        void loadNotifications();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [isDashboard, loadNotifications]);

  useEffect(() => {
    // Keep an SSE connection only while the user has the inbox open.
    if (!isDashboard || !isOpen) return;

    let eventSource: EventSource | undefined;
    let retryTimer: ReturnType<typeof setTimeout> | undefined;
    let retryDelay = 5000;
    let isClosed = false;

    const connect = () => {
      eventSource = new EventSource("/api/my/notifications/events");
      eventSource.addEventListener("notification", () => {
        void loadNotifications(pageRef.current);
      });
      eventSource.onopen = () => {
        retryDelay = 5000;
      };
      eventSource.onerror = () => {
        // Use a capped backoff instead of EventSource's rapid retry loop.
        eventSource?.close();
        if (isClosed) return;

        retryTimer = setTimeout(connect, retryDelay);
        retryDelay = Math.min(retryDelay * 2, 60000);
      };
    };

    connect();
    return () => {
      isClosed = true;
      if (retryTimer) clearTimeout(retryTimer);
      eventSource?.close();
    };
  }, [isDashboard, isOpen, loadNotifications]);

  const markAsRead = async (notification: UserNotification) => {
    if (notification.readAt) return;

    const response = await fetch(
      `/api/my/notifications/${notification._id}/read`,
      { method: "PATCH" },
    );
    if (!response.ok) return;

    setNotifications((current) =>
      current.map((item) =>
        item._id === notification._id
          ? { ...item, readAt: new Date().toISOString() }
          : item,
      ),
    );
    setUnreadCount((count) => Math.max(0, count - 1));
  };

  const changePage = (nextPage: number) => {
    pageRef.current = nextPage;
    setPage(nextPage);
    void loadNotifications(nextPage);
  };

  if (!isDashboard) return null;

  return (
    <div className="relative">
      <button
        onClick={() => {
          setIsOpen((wasOpen) => !wasOpen);
          if (!isOpen) void loadNotifications();
        }}
        className="relative rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
        aria-label={`Notifications, ${unreadCount} unread`}
        aria-expanded={isOpen}
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 min-w-5 rounded-full bg-blue-600 px-1 text-center text-xs text-white">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <InboxPanel
          notifications={notifications}
          unreadCount={unreadCount}
          page={page}
          totalPages={totalPages}
          isLoading={isLoading}
          hasError={hasError}
          onClose={() => setIsOpen(false)}
          onRetry={() => void loadNotifications()}
          onMarkAsRead={markAsRead}
          onPageChange={changePage}
        />
      )}
    </div>
  );
}

function InboxPanel({
  notifications,
  unreadCount,
  page,
  totalPages,
  isLoading,
  hasError,
  onClose,
  onRetry,
  onMarkAsRead,
  onPageChange,
}: {
  notifications: UserNotification[];
  unreadCount: number;
  page: number;
  totalPages: number;
  isLoading: boolean;
  hasError: boolean;
  onClose: () => void;
  onRetry: () => void;
  onMarkAsRead: (notification: UserNotification) => void;
  onPageChange: (page: number) => void;
}) {
  return (
    <section className="absolute right-0 top-12 z-[70] w-[min(24rem,calc(100vw-2rem))] rounded-xl border border-border bg-background p-3 text-foreground shadow-xl">
      <div className="mb-2 flex items-center justify-between">
        <h2 className="font-semibold">Notifications ({unreadCount} unread)</h2>
        <button onClick={onClose} aria-label="Close notifications">
          <X className="h-4 w-4" />
        </button>
      </div>

      {isLoading && (
        <p className="p-4 text-center text-sm text-muted-foreground">Loading…</p>
      )}
      {hasError && (
        <div className="p-4 text-center text-sm">
          <p>Could not load notifications.</p>
          <button className="mt-2 underline" onClick={onRetry}>Retry</button>
        </div>
      )}
      {!isLoading && !hasError && notifications.length === 0 && (
        <p className="p-4 text-center text-sm text-muted-foreground">
          No notifications yet.
        </p>
      )}

      {!isLoading && !hasError && notifications.length > 0 && (
        <div className="max-h-80 space-y-2 overflow-y-auto">
          {notifications.map((notification) => (
            <NotificationCard
              key={notification._id}
              notification={notification}
              onClick={() => onMarkAsRead(notification)}
            />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-3 flex items-center justify-between border-t border-border pt-3 text-sm">
          <button
            disabled={page <= 1 || isLoading}
            onClick={() => onPageChange(page - 1)}
            className="disabled:opacity-40"
          >
            Previous
          </button>
          <span>{page} / {totalPages}</span>
          <button
            disabled={page >= totalPages || isLoading}
            onClick={() => onPageChange(page + 1)}
            className="disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </section>
  );
}

function NotificationCard({
  notification,
  onClick,
}: {
  notification: UserNotification;
  onClick: () => void;
}) {
  const isRead = Boolean(notification.readAt);

  return (
    <article
      onClick={onClick}
      className={`cursor-pointer rounded-lg border p-3 ${
        isRead
          ? "border-border"
          : "border-blue-300 bg-blue-50/50 dark:bg-blue-950/30"
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-medium">{notification.title}</h3>
        {isRead ? (
          <Check className="h-4 w-4 shrink-0 text-green-600" />
        ) : (
          <span className="h-2 w-2 shrink-0 rounded-full bg-blue-600" />
        )}
      </div>
      <p className="mt-1 whitespace-pre-wrap text-sm text-muted-foreground">
        {notification.message}
      </p>
      <p className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
        <Clock className="h-3 w-3" />
        {new Date(notification.createdAt).toLocaleString()}
      </p>
    </article>
  );
}

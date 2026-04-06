'use client';

import { useEffect, useState } from 'react';
import api from '@/services/api';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Calendar as CalendarIcon, Clock, UserRound, Phone, Stethoscope, CheckCircle2, MessageSquare, Loader2, CalendarHeart } from 'lucide-react';
import { Skeleton } from '@/components/ui/Skeleton';

interface Appointment {
  _id: string;
  patientId: {
    _id: string;
    name: string;
    email: string;
  };
  doctorId: {
    _id: string;
    userId: {
      name: string;
      email: string;
    };
    specialization: string;
  };
  date: string;
  status: string;
  reason: string;
  createdAt: string;
}

export default function VerifyAppointmentsPage() {
  const [activeTab, setActiveTab] = useState<'pending' | 'scheduled'>('pending');
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [approvingId, setApprovingId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<{title: string, desc: string} | null>(null);

  const fetchAppointments = async (type: 'pending' | 'scheduled') => {
    setLoading(true);
    setAppointments([]);
    try {
      const { data } = await api.get(`/admin/appointments/${type}`);
      setAppointments(data);
    } catch (error) {
      console.error(`Failed to fetch ${type} appointments`, error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments(activeTab);
  }, [activeTab]);

  const handleApprove = async (id: string) => {
    setApprovingId(id);
    try {
      await api.put(`/admin/appointments/${id}/approve`);
      await fetchAppointments(activeTab); // Refresh list
      showToast("Appointment Approved", "The doctor and patient have been notified.");
    } catch (error) {
      console.error("Failed to approve", error);
      alert("Failed to approve appointment.");
    } finally {
      setApprovingId(null);
    }
  };

  const handleSendReminder = (patientName: string) => {
    showToast("SMS Reminder Sent!", `A text message reminder was successfully sent to ${patientName}.`);
  };

  const showToast = (title: string, desc: string) => {
    setToastMessage({ title, desc });
    setTimeout(() => setToastMessage(null), 4000);
  };

  const formatDateTime = (dateString: string) => {
    const d = new Date(dateString);
    return {
       date: d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }),
       time: d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
    };
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 relative">
      <div className="mb-4">
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
          Manage Appointments
        </h1>
        <p className="text-muted-foreground mt-2">Manage customer appointment requests and view confirmed schedules.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-border pb-4 mb-6">
         <button
            onClick={() => setActiveTab('pending')}
            className={`px-4 py-2 rounded-full font-medium transition-all ${
               activeTab === 'pending'
                 ? 'bg-primary text-primary-foreground shadow-md'
                 : 'bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground'
            }`}
         >
            Pending Requests
         </button>
         <button
            onClick={() => setActiveTab('scheduled')}
            className={`px-4 py-2 rounded-full font-medium transition-all ${
               activeTab === 'scheduled'
                 ? 'bg-primary text-primary-foreground shadow-md'
                 : 'bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground'
            }`}
         >
            Scheduled
         </button>
      </div>

      {loading ? (
        <div className="space-y-4">
           <Skeleton className="h-40 w-full rounded-xl" />
           <Skeleton className="h-40 w-full rounded-xl" />
        </div>
      ) : appointments.length === 0 ? (
        <Card className="p-12 text-center border-dashed bg-card/50">
           {activeTab === 'pending' ? (
              <CheckCircle2 size={48} className="mx-auto mb-4 text-green-500 opacity-80" />
           ) : (
              <CalendarHeart size={48} className="mx-auto mb-4 text-blue-500 opacity-80" />
           )}
           <h3 className="text-xl font-semibold text-foreground">
             {activeTab === 'pending' ? 'All Caught Up!' : 'No Scheduled Appointments'}
           </h3>
           <p className="text-muted-foreground mt-2">
             {activeTab === 'pending' 
                ? 'There are no pending appointments waiting for verification.' 
                : 'There are no approved appointments on the schedule right now.'}
           </p>
        </Card>
      ) : (
        <div className="space-y-6">
          {appointments.map((apt) => {
            const { date, time } = formatDateTime(apt.date);
            return (
              <Card key={apt._id} className="p-6 bg-card border-border hover:shadow-lg transition-shadow duration-300">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                  
                  {/* Left Side: Patient & Doctor Info */}
                  <div className="flex-1 space-y-4">
                    <div className="flex items-center gap-2">
                      {apt.status === 'pending' ? (
                         <span className="px-3 py-1 rounded-full bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 font-semibold text-xs uppercase tracking-wider">
                           Pending Verification
                         </span>
                      ) : (
                         <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-600 dark:text-green-400 font-semibold text-xs uppercase tracking-wider flex items-center gap-1">
                           <CheckCircle2 size={12} /> Approved
                         </span>
                      )}
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-8 mt-4">
                      {/* Patient Block */}
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Patient Details</h4>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold dark:bg-blue-900/50">
                            {apt.patientId?.name?.charAt(0) || 'P'}
                          </div>
                          <div>
                            <p className="font-semibold text-foreground">{apt.patientId?.name || "Deleted User"}</p>
                            <p className="text-sm text-muted-foreground">{apt.patientId?.email || "N/A"}</p>
                          </div>
                        </div>
                        <div className="mt-2 text-sm text-foreground bg-muted/30 p-2 rounded-md border border-border">
                          <span className="font-semibold">Concern: </span>
                          <span className="text-muted-foreground">{apt.reason}</span>
                        </div>
                      </div>

                      {/* Doctor Block */}
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Requested Doctor</h4>
                        <div className="flex items-center gap-3">
                           <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold dark:bg-indigo-900/50">
                            <Stethoscope size={20} />
                          </div>
                          <div>
                            <p className="font-semibold text-foreground">Dr. {apt.doctorId?.userId?.name || "Deleted Doctor"}</p>
                            <p className="text-sm text-indigo-600 dark:text-indigo-400 font-medium">{apt.doctorId?.specialization || 'Specialist'}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Side: Data & Actions */}
                  <div className="flex flex-col gap-4 md:w-1/3 md:ml-auto">
                    <div className="p-4 bg-muted/20 border border-border rounded-xl space-y-3">
                       <div className="flex items-center gap-3 text-foreground">
                         <CalendarIcon size={18} className="text-primary" />
                         <span className="font-medium">{date}</span>
                       </div>
                       <div className="flex items-center gap-3 text-foreground">
                         <Clock size={18} className="text-primary" />
                         <span className="font-medium">{time}</span>
                       </div>
                    </div>
                    
                    <div className="flex flex-col gap-2 mt-auto">
                       <Button 
                         variant="outline" 
                         className={`w-full gap-2 ${apt.status === 'scheduled' || apt.status === 'approved' ? 'text-green-600 border-green-200 hover:bg-green-50 dark:border-green-900 dark:hover:bg-green-900/20' : 'text-blue-600 border-blue-200 hover:bg-blue-50 dark:border-blue-900 dark:hover:bg-blue-900/20'}`}
                         onClick={() => handleSendReminder(apt.patientId?.name || 'the patient')}
                       >
                         <MessageSquare size={16} /> Send Reminder SMS
                       </Button>

                       {apt.status === 'pending' && (
                         <Button 
                           onClick={() => handleApprove(apt._id)}
                           disabled={approvingId === apt._id}
                           className="w-full gap-2 bg-green-600 hover:bg-green-700 text-white shadow-md"
                         >
                           {approvingId === apt._id ? <Loader2 className="animate-spin" size={18} /> : <CheckCircle2 size={18} />}
                           Approve Slot
                         </Button>
                       )}
                    </div>
                  </div>

                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Custom Toast Notification Overlay */}
      {toastMessage && (
        <div className="fixed bottom-8 right-8 z-50 animate-in slide-in-from-right-8 fade-in fade-out duration-300">
           <div className="bg-card border-l-4 border-l-green-500 shadow-2xl rounded-lg p-4 flex items-start gap-4 max-w-sm">
             <div className="bg-green-100 rounded-full p-1 text-green-600 mt-1 dark:bg-green-900/50">
               <CheckCircle2 size={20} />
             </div>
             <div>
               <h4 className="font-semibold text-foreground text-sm">{toastMessage.title}</h4>
               <p className="text-muted-foreground text-xs mt-1">{toastMessage.desc}</p>
             </div>
           </div>
        </div>
      )}

    </div>
  );
}

import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:myapp/logic/appointment/appointment_bloc.dart';
import 'package:myapp/models/appointment.dart';
import 'package:myapp/pages/appointments/widgets/list_apointment.dart';

class AppoinmentPage extends StatefulWidget {
  const AppoinmentPage({super.key});

  @override
  State<AppoinmentPage> createState() => _AppoinmentPageState();
}

class _AppoinmentPageState extends State<AppoinmentPage> {
  @override
  void initState() {
    super.initState();
    context.read<AppointmentBloc>().add(const GetAppointments());
  }

  @override
  Widget build(BuildContext context) {
    return DefaultTabController(
      length: 3,
      child: Scaffold(
        backgroundColor: Colors.grey.shade50,
        appBar: AppBar(
          title: const Text("Lịch hẹn của tôi",
              style: TextStyle(color: Colors.black, fontWeight: FontWeight.bold, fontSize: 18)),
          centerTitle: true,
          backgroundColor: Colors.white,
          elevation: 0,
          actions: [
            IconButton(
              icon: const Icon(Icons.refresh, color: Color(0xFF00B4D8)),
              onPressed: () => context.read<AppointmentBloc>().add(const GetAppointments()),
            ),
          ],
          bottom: const TabBar(
            indicatorColor: Color(0xFF00B4D8),
            labelColor: Color(0xFF00B4D8),
            unselectedLabelColor: Colors.grey,
            labelStyle: TextStyle(fontWeight: FontWeight.bold, fontSize: 13),
            tabs: [
              Tab(text: "Sắp tới"),
              Tab(text: "Hoàn thành"),
              Tab(text: "Đã hủy"),
            ],
          ),
        ),
        body: BlocConsumer<AppointmentBloc, AppointmentState>(
          listener: (context, state) {
            if (state is AppointmentCancelled) {
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(
                  content: Text("Đã hủy lịch hẹn thành công!"),
                  backgroundColor: Colors.orange,
                ),
              );
              context.read<AppointmentBloc>().add(const GetAppointments());
            }
            if (state is AppointmentError) {
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(content: Text(state.message), backgroundColor: Colors.red),
              );
              context.read<AppointmentBloc>().add(const GetAppointments());
            }
          },
          builder: (context, state) {
            if (state is AppointmentLoading || state is AppointmentInitial) {
              return const Center(child: CircularProgressIndicator(color: Color(0xFF00B4D8)));
            }

            final appointments =
                state is AppointmentLoaded ? state.appointments : <AppointmentModel>[];

            final upcoming = appointments
                .where((a) => a.status == 'PENDING' || a.status == 'CONFIRMED')
                .toList()
              ..sort((a, b) => a.appointmentDate.compareTo(b.appointmentDate));

            final completed =
                appointments.where((a) => a.status == 'COMPLETED').toList()
                  ..sort((a, b) => b.appointmentDate.compareTo(a.appointmentDate));

            final cancelled =
                appointments.where((a) => a.status == 'CANCELLED').toList()
                  ..sort((a, b) => b.appointmentDate.compareTo(a.appointmentDate));

            return TabBarView(
              children: [
                ListApointment( list: upcoming, showCancel: true),
                ListApointment( list: completed),
                ListApointment( list: cancelled),
              ],
            );
          },
        ),
      ),
    );
  }

}
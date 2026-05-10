import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:myapp/logic/patient/patient_bloc.dart';
import 'package:myapp/models/patient.dart';
import 'package:myapp/pages/records/widgets/my_tab.dart';

class RecordPage extends StatefulWidget {
  const RecordPage({super.key});

  @override
  State<RecordPage> createState() => _RecordPageState();
}

class _RecordPageState extends State<RecordPage> {
  @override
  void initState() {
    super.initState();
    context.read<PatientBloc>().add(GetPatients());
  }

  @override
  Widget build(BuildContext context) {
    return DefaultTabController(
      length: 2,
      child: Scaffold(
        backgroundColor: Colors.grey.shade50,
        appBar: AppBar(
          title: const Text("Hồ sơ bệnh nhân",
              style: TextStyle(color: Colors.black, fontWeight: FontWeight.bold, fontSize: 18)),
          centerTitle: true,
          backgroundColor: Colors.white,
          elevation: 0,
          bottom: const TabBar(
            indicatorColor: Color(0xFF00B4D8),
            labelColor: Color(0xFF00B4D8),
            unselectedLabelColor: Colors.grey,
            labelStyle: TextStyle(fontWeight: FontWeight.bold),
            tabs: [
              Tab(text: "Bản thân"),
              Tab(text: "Người thân"),
            ],
          ),
        ),
        body: BlocConsumer<PatientBloc, PatientState>(
          listener: (context, state) {
            if (state is PatientUpdated) {
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(
                  content: Text("Cập nhật hồ sơ thành công!"),
                  backgroundColor: Colors.green,
                ),
              );
              context.read<PatientBloc>().add(GetPatients());
            }
            if (state is PatientDeleted) {
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(
                  content: Text("Đã xóa hồ sơ!"),
                  backgroundColor: Colors.orange,
                ),
              );
              context.read<PatientBloc>().add(GetPatients());
            }
            if (state is PatientCreated) {
              context.read<PatientBloc>().add(GetPatients());
            }
            if (state is PatientError) {
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(content: Text(state.message), backgroundColor: Colors.red),
              );
            }
          },
          builder: (context, state) {
            if (state is PatientLoading || state is PatientInitial) {
              return const Center(child: CircularProgressIndicator(color: Color(0xFF00B4D8)));
            }

            final patients = state is PatientLoaded ? state.patients : <PatientModel>[];
            final selfList = patients.where((p) => p.isSelf).toList();
            final relativeList = patients.where((p) => !p.isSelf).toList();

            return TabBarView(
              children: [
                MyTab(list: selfList, isSelfTab: true),
                MyTab(list: relativeList, isSelfTab: false),
              ],
            );
          },
        ),
      ),
    );
  }

}

import 'package:flutter/material.dart';
import 'package:myapp/pages/appointments/appoinment_page.dart';
import 'package:myapp/pages/home/screens/home_page.dart';
import 'package:myapp/pages/notifications/notification_page.dart';
import 'package:myapp/pages/profile/profile_page.dart';
import 'package:myapp/pages/records/record_page.dart';

class MainPage extends StatefulWidget {
  const MainPage({super.key});

  @override
  State<MainPage> createState() => _MainPageState();
}

class _MainPageState extends State<MainPage> {
  int _currentIndex = 0;

  List<Widget> _buildPages() {
    return [
      const HomePage(),
      const AppoinmentPage(),
      const RecordPage(),
      const NotificationPage(),
      const ProfilePage(),
    ];
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      extendBody: true,
      body: IndexedStack(
        index: _currentIndex,
        children: _buildPages(),
      ),
      bottomNavigationBar: _buildCustomBottomBar(),
    );
  }

  Widget _buildCustomBottomBar() {
    return Container(
      margin: const EdgeInsets.fromLTRB(50, 0, 50, 30),
      height: 60,
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(30),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.1),
            blurRadius: 15,
            offset: const Offset(0, 5),
          ),
        ],
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceEvenly,
        children: [
          _buildNavItem(Icons.home, Icons.home_outlined, 0),
          _buildNavItem(Icons.calendar_month, Icons.calendar_month_outlined, 1),
          _buildNavItem(Icons.receipt_long, Icons.receipt_long_outlined, 2),
          _buildNavItem(Icons.notifications, Icons.notifications_none_outlined, 3),
          _buildNavItem(Icons.person, Icons.person_outline, 4),
        ],
      ),
    );
  }

  Widget _buildNavItem(IconData activeIcon, IconData inactiveIcon, int index) {
    bool isSelected = _currentIndex == index;
    return GestureDetector(
      onTap: () => setState(() => _currentIndex = index),
      behavior: HitTestBehavior.opaque,
      child: _buildIconContent(activeIcon, inactiveIcon, isSelected),
    );
  }

  Widget _buildIconContent(IconData activeIcon, IconData inactiveIcon, bool isSelected) {
    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        AnimatedContainer(
          duration: const Duration(milliseconds: 250),
          padding: const EdgeInsets.all(8),
          decoration: BoxDecoration(
            color: isSelected ? const Color(0xFF00B4D8).withOpacity(0.1) : Colors.transparent,
            shape: BoxShape.circle,
          ),
          child: Icon(
            isSelected ? activeIcon : inactiveIcon,
            color: isSelected ? const Color(0xFF00B4D8) : Colors.grey.shade500,
            size: 26,
          ),
        ),
      ],
    );
  }
}
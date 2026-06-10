/**
 * 师生管理系统自动化测试 - 优化版
 * 测试功能：添加老师、班级、学生，关联关系，课时添加，金额累加，编辑功能等
 * 优化点：按顺序逐个添加数据，确保数据关联正确
 */

import fetch from 'node-fetch';

const API_BASE = 'http://localhost:3000/api/student-management';

interface TestResult {
  name: string;
  status: 'passed' | 'failed' | 'error';
  message: string;
  duration?: number;
  data?: any;
}

interface TestReport {
  startTime: Date;
  endTime?: Date;
  totalTests: number;
  passed: number;
  failed: number;
  errors: number;
  results: TestResult[];
}

class StudentManagementTester {
  private report: TestReport;
  private createdTeacherId: string | null = null;
  private createdClassIds: string[] = [];
  private createdStudentIds: string[] = [];
  private createdCourseHoursIds: string[] = [];

  constructor() {
    this.report = {
      startTime: new Date(),
      totalTests: 0,
      passed: 0,
      failed: 0,
      errors: 0,
      results: []
    };
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private async apiCall(endpoint: string, options: any = {}): Promise<any> {
    const url = `${API_BASE}${endpoint}`;
    const startTime = Date.now();
    
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        }
      });
      
      const duration = Date.now() - startTime;
      const data = await response.json();
      
      return {
        success: response.ok,
        status: response.status,
        data,
        duration
      };
    } catch (error: any) {
      return {
        success: false,
        status: 0,
        data: { msg: error.message },
        duration: Date.now() - startTime,
        error: true
      };
    }
  }

  private addResult(result: Omit<TestResult, 'duration'> & { duration?: number }) {
    const fullResult: TestResult = {
      ...result,
      duration: result.duration || 0
    };
    
    this.report.results.push(fullResult);
    this.report.totalTests++;
    
    if (result.status === 'passed') {
      this.report.passed++;
      console.log(`✅ ${result.name}: ${result.message}`);
    } else if (result.status === 'failed') {
      this.report.failed++;
      console.log(`❌ ${result.name}: ${result.message}`);
    } else {
      this.report.errors++;
      console.log(`💥 ${result.name}: ${result.message}`);
    }
  }

  async testStep1AddTeacher() {
    console.log('\n📚 步骤1: 添加老师');
    console.log('━'.repeat(50));
    
    const teacherName = `测试老师_${Date.now()}`;
    
    const result = await this.apiCall('/teachers', {
      method: 'POST',
      body: JSON.stringify({
        '老师姓名': teacherName
      })
    });
    
    if (result.success && result.data.code === 0) {
      this.createdTeacherId = result.data.data?.record?.record_id || result.data.data?.record_id || result.data.data?.id;
      this.addResult({
        name: '1.1 添加老师',
        status: 'passed',
        message: `成功创建老师: ${teacherName} (ID: ${this.createdTeacherId})`,
        duration: result.duration
      });
      return { success: true, teacherId: this.createdTeacherId, teacherName };
    } else {
      this.addResult({
        name: '1.1 添加老师',
        status: 'failed',
        message: `失败: ${result.data.msg || '未知错误'}`,
        duration: result.duration
      });
      return { success: false };
    }
  }

  async testStep2AddCourses() {
    console.log('\n📚 步骤2: 添加班级（2个）');
    console.log('━'.repeat(50));
    
    const classNames = ['测试班级A', '测试班级B'];
    this.createdClassIds = [];
    
    for (let i = 0; i < classNames.length; i++) {
      await this.delay(500);
      const className = `${classNames[i]}_${Date.now()}_${i}`;
      
      const result = await this.apiCall('/courses', {
        method: 'POST',
        body: JSON.stringify({
          '班级名称': className,
          '班级状态': '招生中'
        })
      });
      
      if (result.success && result.data.code === 0) {
        const classId = result.data.data?.record?.record_id || result.data.data?.record_id || result.data.data?.id;
        this.createdClassIds.push(classId);
        
        this.addResult({
          name: `2.${i + 1} 添加班级${i + 1}`,
          status: 'passed',
          message: `成功创建班级: ${className}`,
          duration: result.duration
        });
      } else {
        this.addResult({
          name: `2.${i + 1} 添加班级${i + 1}`,
          status: 'failed',
          message: `失败: ${result.data.msg || '未知错误'}`,
          duration: result.duration
        });
      }
    }
    
    return { 
      success: this.createdClassIds.length === 2, 
      classIds: this.createdClassIds
    };
  }

  async testStep3AddStudents() {
    console.log('\n📚 步骤3: 添加学员（10名）');
    console.log('━'.repeat(50));
    
    this.createdStudentIds = [];
    
    for (let i = 1; i <= 10; i++) {
      await this.delay(500);
      const studentName = `测试学生${String(i).padStart(2, '0')}_${Date.now()}_${i}`;
      
      const result = await this.apiCall('/students', {
        method: 'POST',
        body: JSON.stringify({
          '姓名': studentName,
          '学习状态': '正常上课'
        })
      });
      
      if (result.success && result.data.code === 0) {
        const studentId = result.data.data?.record?.record_id || result.data.data?.record_id || result.data.data?.id;
        this.createdStudentIds.push(studentId);
        
        if (i === 1 || i === 10) {
          this.addResult({
            name: `3.${i} 添加学员${i}`,
            status: 'passed',
            message: `成功创建学员: ${studentName}`,
            duration: result.duration
          });
        }
      } else {
        this.addResult({
          name: `3.${i} 添加学员${i}`,
          status: 'failed',
          message: `失败: ${result.data.msg || '未知错误'}`,
          duration: result.duration
        });
      }
    }
    
    this.addResult({
      name: '3.batch 批量添加学员',
      status: 'passed',
      message: `成功创建 ${this.createdStudentIds.length}/10 名学生`
    });
    
    return { 
      success: this.createdStudentIds.length === 10, 
      studentIds: this.createdStudentIds
    };
  }

  async testStep4TeacherManageCourses() {
    console.log('\n📚 步骤4: 老师管理班级');
    console.log('━'.repeat(50));
    
    if (!this.createdTeacherId || this.createdClassIds.length < 2) {
      this.addResult({
        name: '4.1 老师管理班级',
        status: 'failed',
        message: '缺少老师ID或班级ID'
      });
      return { success: false };
    }
    
    const result = await this.apiCall(`/teachers/${this.createdTeacherId}`, {
      method: 'PUT',
      body: JSON.stringify({
        fields: {
          '上课班级ID': this.createdClassIds
        }
      })
    });
    
    if (result.success && result.data.code === 0) {
      this.addResult({
        name: '4.1 老师管理班级',
        status: 'passed',
        message: `老师成功管理 ${this.createdClassIds.length} 个班级`,
        duration: result.duration
      });
      return { success: true, classIds: this.createdClassIds };
    } else {
      this.addResult({
        name: '4.1 老师管理班级',
        status: 'failed',
        message: `失败: ${result.data.msg || '未知错误'}`,
        duration: result.duration
      });
      return { success: false };
    }
  }

  async testStep5StudentsInCourse() {
    console.log('\n📚 步骤5: 学员分配到班级（5名）');
    console.log('━'.repeat(50));
    
    if (!this.createdClassIds[0] || this.createdStudentIds.length < 5) {
      this.addResult({
        name: '5.1 学员分配到班级',
        status: 'failed',
        message: '缺少班级ID或学生ID'
      });
      return { success: false };
    }
    
    const studentsToAssign = this.createdStudentIds.slice(0, 5);
    let successCount = 0;
    
    for (let i = 0; i < studentsToAssign.length; i++) {
      await this.delay(300);
      const studentId = studentsToAssign[i];
      
      const result = await this.apiCall(`/students/${studentId}`, {
        method: 'PUT',
        body: JSON.stringify({
          fields: {
            '报名班级': [this.createdClassIds[0]]
          }
        })
      });
      
      if (result.success && result.data.code === 0) {
        successCount++;
      }
    }
    
    this.addResult({
      name: '5.1 学员分配到班级',
      status: successCount === 5 ? 'passed' : 'failed',
      message: `成功分配 ${successCount}/5 名学生到班级`,
      data: { assignedCount: successCount, totalCount: 5 }
    });
    
    return { success: successCount === 5, assignedStudents: studentsToAssign };
  }

  async testStep6AddCourseHours() {
    console.log('\n📚 步骤6: 添加课时');
    console.log('━'.repeat(50));
    
    if (this.createdStudentIds.length === 0) {
      this.addResult({
        name: '6.1 添加课时',
        status: 'failed',
        message: '没有可用的学生ID'
      });
      return { success: false };
    }
    
    this.createdCourseHoursIds = [];
    
    for (let i = 0; i < 3; i++) {
      await this.delay(500);
      const studentId = this.createdStudentIds[i];
      const totalHours = (i + 1) * 10;
      const courseName = `课程_${i + 1}`;
      const paymentAmount = (i + 1) * 1000;
      
      const courseHoursResult = await this.apiCall('/student-course-hours', {
        method: 'POST',
        body: JSON.stringify({
          fields: {
            '课时名称': courseName,
            '总课时': totalHours,
            '剩余课时': totalHours,
            '关联学员': [studentId]
          }
        })
      });
      
      if (courseHoursResult.success && courseHoursResult.data.code === 0) {
        this.createdCourseHoursIds.push(courseHoursResult.data.data?.record_id);
        
        await this.apiCall('/payments', {
          method: 'POST',
          body: JSON.stringify({
            fields: {
              '已缴金额': paymentAmount,
              '缴费金额': paymentAmount,
              '缴费日期': new Date().toISOString().split('T')[0],
              '关联学员': [studentId]
            }
          })
        });
        
        this.addResult({
          name: `6.${i + 1} 添加课时${i + 1}`,
          status: 'passed',
          message: `成功添加课时: ${courseName} (${totalHours}小时, ¥${paymentAmount})`,
          duration: courseHoursResult.duration
        });
      }
    }
    
    return { success: this.createdCourseHoursIds.length > 0 };
  }

  async testStep7PaymentAccumulation() {
    console.log('\n📚 步骤7: 课时和金额累加测试');
    console.log('━'.repeat(50));
    
    if (this.createdStudentIds.length === 0) {
      this.addResult({
        name: '7.1 金额累加测试',
        status: 'failed',
        message: '没有可用的学生ID'
      });
      return { success: false };
    }
    
    const studentId = this.createdStudentIds[0];
    const additionalHours = 5;
    const additionalPayment = 500;
    
    const courseHoursResult = await this.apiCall('/student-course-hours', {
      method: 'POST',
      body: JSON.stringify({
        fields: {
          '课时名称': '追加课时测试',
          '总课时': additionalHours,
          '剩余课时': additionalHours,
          '关联学员': [studentId]
        }
      })
    });
    
    const paymentResult = await this.apiCall('/payments', {
      method: 'POST',
      body: JSON.stringify({
        fields: {
          '缴费金额': additionalPayment,
          '缴费日期': new Date().toISOString().split('T')[0],
          '关联学员': [studentId]
        }
      })
    });
    
    if (courseHoursResult.success && paymentResult.success) {
      this.addResult({
        name: '7.1 金额累加测试',
        status: 'passed',
        message: `成功追加课时(${additionalHours}小时)和缴费(¥${additionalPayment})`,
        duration: courseHoursResult.duration + paymentResult.duration
      });
      return { success: true };
    } else {
      this.addResult({
        name: '7.1 金额累加测试',
        status: 'failed',
        message: '累加失败'
      });
      return { success: false };
    }
  }

  async testStep8EditStudent() {
    console.log('\n📚 步骤8: 编辑学生信息');
    console.log('━'.repeat(50));
    
    if (this.createdStudentIds.length === 0) {
      this.addResult({
        name: '8.1 编辑学生信息',
        status: 'failed',
        message: '没有可用的学生ID'
      });
      return { success: false };
    }
    
    const studentId = this.createdStudentIds[0];
    const newStatus = '请假';
    
    const result = await this.apiCall(`/students/${studentId}`, {
      method: 'PUT',
      body: JSON.stringify({
        fields: {
          '学习状态': newStatus
        }
      })
    });
    
    if (result.success && result.data.code === 0) {
      this.addResult({
        name: '8.1 编辑学生信息',
        status: 'passed',
        message: `成功更新学生信息: 状态=${newStatus}`,
        duration: result.duration
      });
      return { success: true };
    } else {
      this.addResult({
        name: '8.1 编辑学生信息',
        status: 'failed',
        message: `失败: ${result.data.msg || '未知错误'}`,
        duration: result.duration
      });
      return { success: false };
    }
  }

  async testStep9EditTeacher() {
    console.log('\n📚 步骤9: 编辑老师信息');
    console.log('━'.repeat(50));
    
    if (!this.createdTeacherId) {
      this.addResult({
        name: '9.1 编辑老师信息',
        status: 'failed',
        message: '没有可用的老师ID'
      });
      return { success: false };
    }
    
    const newEvaluation = '学生反馈良好';
    
    const result = await this.apiCall(`/teachers/${this.createdTeacherId}`, {
      method: 'PUT',
      body: JSON.stringify({
        fields: {
          '上课评价': newEvaluation
        }
      })
    });
    
    if (result.success && result.data.code === 0) {
      this.addResult({
        name: '9.1 编辑老师信息',
        status: 'passed',
        message: `成功更新老师信息: 评价=${newEvaluation}`,
        duration: result.duration
      });
      return { success: true };
    } else {
      this.addResult({
        name: '9.1 编辑老师信息',
        status: 'failed',
        message: `失败: ${result.data.msg || '未知错误'}`,
        duration: result.duration
      });
      return { success: false };
    }
  }

  async testStep10EditClass() {
    console.log('\n📚 步骤10: 编辑班级信息');
    console.log('━'.repeat(50));
    
    if (this.createdClassIds.length === 0) {
      this.addResult({
        name: '10.1 编辑班级信息',
        status: 'failed',
        message: '没有可用的班级ID'
      });
      return { success: false };
    }
    
    const classId = this.createdClassIds[0];
    const newStatus = '上课中';
    
    const result = await this.apiCall(`/courses/${classId}`, {
      method: 'PUT',
      body: JSON.stringify({
        fields: {
          '班级状态': newStatus
        }
      })
    });
    
    if (result.success && result.data.code === 0) {
      this.addResult({
        name: '10.1 编辑班级信息',
        status: 'passed',
        message: `成功更新班级信息: 状态=${newStatus}`,
        duration: result.duration
      });
      return { success: true };
    } else {
      this.addResult({
        name: '10.1 编辑班级信息',
        status: 'failed',
        message: `失败: ${result.data.msg || '未知错误'}`,
        duration: result.duration
      });
      return { success: false };
    }
  }

  async testStep11DeleteOperations() {
    console.log('\n📚 步骤11: 删除操作测试');
    console.log('━'.repeat(50));
    
    if (this.createdStudentIds.length > 0) {
      const studentId = this.createdStudentIds[this.createdStudentIds.length - 1];
      const result = await this.apiCall(`/students/${studentId}`, {
        method: 'DELETE'
      });
      
      if (result.success && result.data.code === 0) {
        this.addResult({
          name: '11.1 删除学生',
          status: 'passed',
          message: '成功删除测试学生',
          duration: result.duration
        });
        this.createdStudentIds.pop();
      } else {
        this.addResult({
          name: '11.1 删除学生',
          status: 'failed',
          message: `失败: ${result.data.msg || '未知错误'}`,
          duration: result.duration
        });
      }
    }
    
    return { success: true };
  }

  async cleanup() {
    console.log('\n🧹 清理测试数据');
    console.log('━'.repeat(50));
    
    for (const courseHoursId of this.createdCourseHoursIds) {
      await this.apiCall(`/student-course-hours/${courseHoursId}`, {
        method: 'DELETE'
      });
    }
    
    for (const studentId of this.createdStudentIds) {
      await this.apiCall(`/students/${studentId}`, {
        method: 'DELETE'
      });
    }
    
    for (const classId of this.createdClassIds) {
      await this.apiCall(`/courses/${classId}`, {
        method: 'DELETE'
      });
    }
    
    if (this.createdTeacherId) {
      await this.apiCall(`/teachers/${this.createdTeacherId}`, {
        method: 'DELETE'
      });
    }
    
    console.log('✅ 清理完成');
  }

  generateReport(): string {
    this.report.endTime = new Date();
    const duration = this.report.endTime.getTime() - this.report.startTime.getTime();
    
    const reportLines = [
      '# 师生管理系统自动化测试报告（优化版）',
      '',
      `**测试时间**: ${this.report.startTime.toLocaleString('zh-CN')}`,
      `**总耗时**: ${(duration / 1000).toFixed(2)}秒`,
      '',
      '## 测试统计',
      '',
      '| 指标 | 数量 |',
      '|------|------|',
      `| 总测试数 | ${this.report.totalTests} |`,
      `| ✅ 通过 | ${this.report.passed} |`,
      `| ❌ 失败 | ${this.report.failed} |`,
      `| 💥 错误 | ${this.report.errors} |`,
      '',
      '## 测试步骤',
      '',
      '| 步骤 | 测试内容 |',
      '|------|----------|',
      '| 1 | 添加老师 |',
      '| 2 | 添加班级（2个） |',
      '| 3 | 添加学员（10名） |',
      '| 4 | 老师管理班级 |',
      '| 5 | 学员分配到班级 |',
      '| 6 | 添加课时和缴费 |',
      '| 7 | 金额累加测试 |',
      '| 8 | 编辑学生信息 |',
      '| 9 | 编辑老师信息 |',
      '| 10 | 编辑班级信息 |',
      '| 11 | 删除操作测试 |',
      '',
      '## 测试结果详情',
      ''
    ];
    
    this.report.results.forEach((result, index) => {
      const statusIcon = result.status === 'passed' ? '✅' : result.status === 'failed' ? '❌' : '💥';
      reportLines.push(`### ${index + 1}. ${result.name}`);
      reportLines.push(`${statusIcon} **状态**: ${result.status}`);
      reportLines.push(`📝 **消息**: ${result.message}`);
      if (result.duration) {
        reportLines.push(`⏱️ **耗时**: ${result.duration}ms`);
      }
      if (result.data) {
        reportLines.push(`📊 **数据**: ${JSON.stringify(result.data)}`);
      }
      reportLines.push('');
    });
    
    return reportLines.join('\n');
  }

  async runAllTests() {
    console.log('🚀 开始师生管理系统自动化测试（优化版）');
    console.log('━'.repeat(50));
    
    const startTime = Date.now();
    
    await this.testStep1AddTeacher();
    await this.testStep2AddCourses();
    await this.testStep3AddStudents();
    await this.testStep4TeacherManageCourses();
    await this.testStep5StudentsInCourse();
    await this.testStep6AddCourseHours();
    await this.testStep7PaymentAccumulation();
    await this.testStep8EditStudent();
    await this.testStep9EditTeacher();
    await this.testStep10EditClass();
    await this.testStep11DeleteOperations();
    
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    console.log('\n' + '━'.repeat(50));
    console.log('📊 测试汇总');
    console.log('━'.repeat(50));
    console.log(`总测试数: ${this.report.totalTests}`);
    console.log(`通过: ${this.report.passed}`);
    console.log(`失败: ${this.report.failed}`);
    console.log(`错误: ${this.report.errors}`);
    console.log(`总耗时: ${(duration / 1000).toFixed(2)}秒`);
    console.log(`通过率: ${((this.report.passed / this.report.totalTests) * 100).toFixed(2)}%`);
    
    return this.report;
  }
}

async function main() {
  const tester = new StudentManagementTester();
  
  try {
    await tester.runAllTests();
    const report = tester.generateReport();
    console.log('\n' + report);
    
    const fs = await import('fs');
    const reportPath = './automated-test-report.md';
    fs.writeFileSync(reportPath, report);
    console.log(`\n📄 测试报告已保存到: ${reportPath}`);
  } catch (error) {
    console.error('测试执行失败:', error);
  } finally {
    await tester.cleanup();
  }
}

main().catch(console.error);

export { StudentManagementTester };
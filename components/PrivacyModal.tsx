'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

const privacyContent = {
  lastUpdated: '2024年1月1日',
  content: [
    {
      title: '引言',
      text: '金博士AI实验室（以下简称"我们"）非常重视您的个人信息和隐私保护。本隐私政策旨在向您说明我们如何收集、使用、存储和保护您的个人信息，以及您享有的相关权利。请您在使用我们的服务前，仔细阅读并了解本隐私政策的全部内容。'
    },
    {
      title: '信息收集范围',
      text: '我们收集的信息仅限为您提供服务所必需的范围，包括但不限于：您在注册账号时提供的姓名、联系方式；在使用课程服务时产生的学习记录；以及您主动填写的问卷调查信息等。我们承诺仅收集与提供服务直接相关的必要信息。'
    },
    {
      title: '信息使用目的',
      text: '我们收集您的信息主要用于：为您提供个性化的AI教育服务；优化和改进我们的课程内容；与您进行学习进度沟通；以及在您同意的情况下，向您推送相关的学习资源和活动信息。我们不会将您的信息用于与提供服务无关的目的。'
    },
    {
      title: '信息保护措施',
      text: '我们采用了行业标准的安全技术和管理措施来保护您的个人信息安全，包括数据加密存储、访问权限控制、网络安全防护等。我们定期进行安全评估和漏洞修复，确保您的信息得到妥善保护。'
    },
    {
      title: '第三方共享',
      text: '除以下情况外，我们不会与任何第三方共享您的个人信息：获得您的明确同意；根据法律法规的要求或政府主管部门的要求；以及为保护我们的合法权益而必须披露的情况。'
    },
    {
      title: 'Cookie使用',
      text: '我们的网站可能会使用Cookie来改善您的用户体验。Cookie是存储在您设备上的小型文本文件，用于记住您的偏好设置和登录状态。您可以通过浏览器设置拒绝Cookie，但这可能会影响部分网站功能。'
    },
    {
      title: '用户权利',
      text: '您对自己的个人信息享有以下权利：访问权——您有权访问您的个人信息；更正权——您有权要求更正不准确的信息；删除权——您有权要求删除您的个人信息。如需行使上述权利，请通过我们的官方联系方式与我们联系。'
    },
    {
      title: '儿童隐私',
      text: '我们的服务不面向未满18周岁的未成年人。如果您发现我们无意中收集了未成年人的个人信息，请立即联系我们，我们将及时删除相关数据。'
    },
    {
      title: '政策更新',
      text: '我们可能会不时更新本隐私政策。如有重大变更，我们将在变更生效前通过网站公告或弹窗通知的方式提醒您。请您定期查阅本页面以了解最新内容。'
    },
    {
      title: '联系我们',
      text: '如果您对本隐私政策有任何疑问、意见或建议，或者发现您的个人信息被泄露，请立即通过以下方式与我们联系：客服邮箱 26256649@qq.com，联系电话 15811055744。我们将在收到您的反馈后尽快予以处理。'
    }
  ]
}

interface PrivacyModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function PrivacyModal({ isOpen, onClose }: PrivacyModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-[100] p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[85vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">隐私政策</h2>
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5 text-slate-600" />
              </button>
            </div>

            <div className="overflow-y-auto max-h-[calc(85vh-80px)] p-6">
              <p className="text-sm text-slate-500 mb-6">最后更新日期：{privacyContent.lastUpdated}</p>

              <div className="space-y-6">
                {privacyContent.content.map((section, index) => (
                  <div key={index}>
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">{section.title}</h3>
                    <p className="text-slate-600 leading-relaxed whitespace-pre-line">{section.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
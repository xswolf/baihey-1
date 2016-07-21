/**
 * Created by Administrator on 2016/2/19.
 */
$(function () {

    function getUrlParamToArr() {
        var url = window.location.search;
        url = url.substring(1);
        var urlArr = url.split("&");
        var params = {}
        for (var i in urlArr) {
            var oS = urlArr[i].split('=');
            var k = oS[0];
            var v = oS[1];

            v = decodeURIComponent(v);
            params[k] = v;
        }
        return params;
    }

    $('.j-datatables').each(function () {
        var $this = $(this);
        var $filterContainer = $this.data('filter-container') ? $($this.data('filter-container')) : $(document);
        var filters = [];
        var ext_params = {
            "pagingType": "full_numbers",
            "sLoadingRecords": "正在加载数据...",
            "sZeroRecords": "暂无数据",
            stateSave: true,
            "searching": false,
            "dom": 'rt<"bottom"iflp<"clear">>',
            "language": {
                "processing": "玩命加载中...",
                "lengthMenu": "显示 _MENU_ 项结果",
                "zeroRecords": "没有匹配结果",
                "info": "显示第 _START_ 至 _END_ 项结果，共 _TOTAL_ 项",
                "infoEmpty": "显示第 0 至 0 项结果，共 0 项",
                "infoFiltered": "(由 _MAX_ 项结果过滤)",
                "infoPostFix": "",
                "url": "",
                "paginate": {
                    "first": "首页",
                    "previous": "上一页",
                    "next": "下一页",
                    "last": "末页"
                }
            }
        }

        if ($this.data('is-ajax') == 1) {
            var ajaxUrl = $this.data('ajax-url')
            ext_params.bServerSide = true;
            ext_params.stateSave = false;
            ext_params.sAjaxSource = ajaxUrl;
            ext_params.fnServerData = function (sSource, aoData, fnCallback) {
                var params = getUrlParamToArr();
                for (var i in params) {
                    aoData.push({"name": i, "value": params[i]});
                }
                $.ajax({
                    "type": 'GET',
                    "url": ajaxUrl,
                    "dataType": "json",
                    "data": aoData,
                    "success": function (resp) {
                        fnCallback(resp);
                    }
                });

            };
            ext_params.columns = [
                {
                    "data": "info.head_pic", "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {
                    $(nTd).html("<a href='/admin/member/info?id=" + oData.id + "'><img class='user_img' src='" + oData.info.head_pic + "'></a>");
                }
                },
                {"data": "id"},
                {"data": "info.real_name"},
                {"data": "sex"},
                {"data": "age"},
                {"data": "info.is_marriage"},
                {"data": "info.height"},
                {
                    "data": "info.education", fnCreatedCell: function (nTd, sData, oData, iRow, iCol) {
                    var education = '';
                    if (oData.info.education == 1) {
                        education = '初中';
                    } else if (oData.info.education == 2) {
                        education = '高中';
                    } else if (oData.info.education == 3) {
                        education = '大专';
                    } else if (oData.info.education == 4) {
                        education = '本科';
                    } else if (oData.info.education == 5) {
                        education = '硕士';
                    } else if (oData.info.education == 6) {
                        education = '博士';
                    }
                    $(nTd).html(education);
                }
                },
                {"data": "info.level"},
                {"data": "service_status"},
                {"data": "is_auth"},
                {"data": "is_sign"},
                {
                    "data": "is_show", fnCreatedCell: function (nTd, sData, oData, iRow, iCol) {
                    var isShow = '';
                    if (oData.is_show == 1) {
                        isShow = '开放';
                    } else {
                        isShow = '<span style="color: red;">关闭</span>';
                    }
                    $(nTd).html(isShow);
                }
                },
                {
                    "data": "area", fnCreatedCell: function (nTd, sData, oData, iRow, iCol) {
                    for (var i in area) {
                        if (area[i].id == oData.area) {
                            $(nTd).html(area[i].name + " " + oData.address)
                            break;
                        }
                    }
                }
                },
                {"data": "auth.identity_check"},
                {
                    "data": "status", fnCreatedCell: function (nTd, sData, oData, iRow, iCol) {
                    var html = '';
                    if (oData.status == 1) {
                        html = '未分配红娘';
                    } else if (oData.status == 2) {
                        html = '已分配红娘';
                    } else if (oData.status == 3) {
                        html = '黑名单';
                    } else if (oData.status == 4) {
                        html = '删除';
                    }
                    $(nTd).html(html)
                }
                },
                {
                    "data": "id", "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {
                    var html = '<a class="btn btn-primary btn-sm" href="/admin/member/info?id=' + oData.id + '">管理</a> <a class="btn btn-info btn-sm" data-uid="' + oData.id + '" data-uname="' + oData.info.real_name + '" id="returningBtn" href="javascript:;">回访</a> <a class="btn btn-info btn-sm" href="javascript:;">配对</a>';
                    $(nTd).html(html);
                }
                }
            ]

        }
        var table = $this.DataTable(ext_params);

        $('.j-dt-filter', $filterContainer).each(function () {
            var $this = $(this);
            var type;
            if ($this.is('.j-dt-filter-range')) {
                type = 'range';
            } else if ($this.is('.j-dt-filter-group')) {
                type = 'group';
            } else if ($this.is('input[type=text]')) {
                type = 'text';
            } else if ($this.is('.select-like')) {
                type = 'selectLike';
            } else if ($this.is('select')) {
                type = 'select';
            } else if ($this.is('input[type=checkbox]')) {
                type = 'checkbox';
            } else if ($this.is('input[type=radio]')) {
                type = 'radio';
            }
            var f = new Filter($this, type, $filterContainer);
            f.table = table;
            filters.push(f);
            f.init(); // 初始化
        });

        var filterLength = filters.length;
        $.fn.dataTable.ext.search.push(function (settings, data, dataIndex) {

            for (var i = 0; i < filterLength; i++) {
                if (!filters[i].search(settings, data, dataIndex)) {
                    return false;
                }
            }
            return true;
        });

    });
});


////////////////// Filter Start ////////////////////////
var Filter = function ($dom, type, $container) {
    this.$dom = $dom;
    this.type = type;
    this.table = null;
    this.col = null;
    this.$container = $container;
};
// 初始化,调用相应类型的init方法绑定事件
Filter.prototype.init = function () {
    if (this.table == null) {
        return true;
    }
    // 获取列序号
    if (this.col == null) {
        var col = this.$dom.data('col');
        if (parseInt(col, 10) == col) {
            this.col = col;
        } else {
            this.col = this.table.column(col).index();
            if (typeof this.col === 'undefined') {
                throw new Error('Cannot find col: "' + col + '"');
            }
        }
    }

    this[this.type + 'Init'].call(this);
};
// 搜索,调用相应类型search方法执行过滤
Filter.prototype.search = function (settings, data, dataIndex) {
    var method = this[this.type + 'Search'];
    return method ? method.call(this, settings, data, dataIndex) : true;
};
Filter.prototype.textInit = function () {
    var _this = this;
    var t = 0;
    this.$dom.on('keyup', function () {
        if (t > 0) {
            clearTimeout(t);
        }
        t = setTimeout(function () {
            _this.table.column(_this.col).search(_this.$dom.val()).draw();
        }, 100);
    });
};
Filter.prototype.radioInit = function () {
    var _this = this;
    this.radioName = this.$dom.attr('name');
    this.$radioDom = this.$container.find('.j-dt-filter[name=' + this.radioName + ']');
    this.$dom.on('change', function () {
        var value;
        _this.$radioDom.each(function () {
            var $this = $(this);
            if ($this.prop('checked')) {
                value = $this.val();
            }
        });
        if (value) {
            _this.table.column(_this.col).search(value).draw();
        }
    });
};
Filter.prototype.checkboxInit = function () {
    // TODO
};
Filter.prototype.checkboxSearch = function () {
    // TODO
};
Filter.prototype.selectInit = function () {
    var _this = this;
    this.$dom.on('change', function () {
        var val = $.fn.dataTable.util.escapeRegex(
            _this.$dom.val()
        );
        console.log(_this.col);

        _this.table.column(_this.col).search(val ? '^' + val + '$' : '', true, false).draw();
    });
};
Filter.prototype.selectLikeInit = function () {

    var _this = this;
    this.$dom.on('change', function () {
        var val = $.fn.dataTable.util.escapeRegex(
            _this.$dom.val()
        );
        _this.table.column(_this.col)
            .search(val ? val : '', true, false).draw();
    })
};
Filter.prototype.rangeInit = function () {
    var _this = this;
    this.rangeType = this.$dom.data('range-type') == 'end' ? 'end' : 'start';
    this.rangeName = this.$dom.data('range-name');

    var otherRangeType = this.rangeType == 'end' ? 'start' : 'end';
    this.$rangeDom = this.$container
        .find('.j-dt-filter-range[data-range-name=' + this.rangeName + '][data-range-type=' + otherRangeType + ']');
    this.$dom.on('change', function () {
        _this.table.draw();
    });
};
Filter.prototype.rangeSearch = function (settings, data, dataIndex) {
    var vs = this.$dom.val();
    var ve = this.$rangeDom.val();
    if (this.rangeType == 'end') {
        var _v = vs;
        vs = ve;
        ve = _v;
    }

    var res = true;
    if (vs) {
        res = res && (data[this.col] >= vs);
    }
    if (ve) {
        res = res && (data[this.col] <= ve);
    }

    return res;
};
Filter.prototype.groupInit = function () {
    var _this = this;
    this.groupName = this.$dom.data('group-name');
    this.$groupDom = this.$container
        .find('.j-dt-filter-group[data-group-name=' + this.groupName + ']');
    this.groupSplit = this.$dom.data('group-split');

    this.$dom.on('change', function () {
        setTimeout(function () {
            _this.table.draw();
        });
    });
};
Filter.prototype.groupSearch = function (settings, data, dataIndex) {
    var group = [];
    this.$groupDom.each(function () {
        var $this = $(this);
        if ($this.is(':checked,:selected')) {
            group.push($this.val());
        }
    });

    if (group.length) {
        if (!data[this.col]) {
            return false;
        }
        var dataGroup = data[this.col].split(this.groupSplit);
        if (dataGroup.length < group.length) {
            return false;
        }

        dataGroup = dataGroup.join(this.groupSplit) + this.groupSplit;
        for (var i = 0, len = group.length; i < len; i++) {
            if (dataGroup.indexOf(group[i] + this.groupSplit) == -1) {
                return false;
            }
        }
    }

    return true
}